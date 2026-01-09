const privateKeyField = document.getElementById("privateKeyField");
const saveButton = document.getElementById("saveButton");
const addressValue = document.getElementById("addressValue");
const statusMessage = document.getElementById("statusMessage");

const setStatus = (message) => {
  statusMessage.textContent = message;
};

const setAddress = (address) => {
  addressValue.textContent = address || "暂无";
};

const loadStoredWallet = () => {
  chrome.storage.local.get(["quickInputWallet"], (result) => {
    if (result.quickInputWallet?.address) {
      setAddress(result.quickInputWallet.address);
      setStatus("已保存私钥，可再次生成地址。");
    } else {
      setAddress("暂无");
      setStatus("请输入私钥并保存");
    }
  });
};

saveButton.addEventListener("click", () => {
  const privateKey = privateKeyField.value.trim();

  if (!privateKey) {
    setStatus("请输入私钥。");
    return;
  }

  try {
    const wallet = new ethers.Wallet(privateKey);
    chrome.storage.local.set(
      {
        quickInputWallet: {
          privateKey: wallet.privateKey,
          address: wallet.address,
        },
      },
      () => {
        setAddress(wallet.address);
        privateKeyField.value = "";
        setStatus("已保存私钥并生成地址。");
      }
    );
  } catch (error) {
    console.error(error);
    setStatus("私钥格式不正确，请检查。");
  }
});

loadStoredWallet();
