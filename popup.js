const inputField = document.getElementById("inputField");
const passwordField = document.getElementById("passwordField");
const saveButton = document.getElementById("saveButton");
const decryptButton = document.getElementById("decryptButton");
const statusMessage = document.getElementById("statusMessage");

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const toBase64 = (buffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buffer)));
const fromBase64 = (value) =>
  Uint8Array.from(atob(value), (char) => char.charCodeAt(0));

const setStatus = (message) => {
  statusMessage.textContent = message;
};

const getKey = async (password, salt) => {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 120000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

const encryptValue = async (value, password) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getKey(password, salt);
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(value)
  );

  return {
    ciphertext: toBase64(ciphertext),
    iv: toBase64(iv),
    salt: toBase64(salt),
  };
};

const decryptValue = async (payload, password) => {
  const iv = fromBase64(payload.iv);
  const salt = fromBase64(payload.salt);
  const key = await getKey(password, salt);
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    fromBase64(payload.ciphertext)
  );

  return decoder.decode(plaintext);
};

chrome.storage.local.get(["quickInputEncrypted"], (result) => {
  if (result.quickInputEncrypted) {
    setStatus("已加密保存，输入口令后点击解密查看。");
  } else {
    setStatus("暂无数据");
  }
});

saveButton.addEventListener("click", async () => {
  const value = inputField.value.trim();
  const password = passwordField.value.trim();

  if (!value) {
    setStatus("请输入要加密的内容。");
    return;
  }

  if (!password) {
    setStatus("请输入加密口令。");
    return;
  }

  try {
    const encrypted = await encryptValue(value, password);
    chrome.storage.local.set({ quickInputEncrypted: encrypted }, () => {
      inputField.value = "";
      setStatus("已加密并保存。");
    });
  } catch (error) {
    setStatus("加密失败，请重试。");
    console.error(error);
  }
});

decryptButton.addEventListener("click", async () => {
  const password = passwordField.value.trim();

  if (!password) {
    setStatus("请输入解密口令。");
    return;
  }

  chrome.storage.local.get(["quickInputEncrypted"], async (result) => {
    if (!result.quickInputEncrypted) {
      setStatus("暂无可解密的数据。");
      return;
    }

    try {
      const value = await decryptValue(result.quickInputEncrypted, password);
      setStatus(`已解密：${value}`);
    } catch (error) {
      setStatus("解密失败，请检查口令。");
      console.error(error);
    }
  });
});
