const inputField = document.getElementById("inputField");
const saveButton = document.getElementById("saveButton");
const savedValue = document.getElementById("savedValue");

const updateSavedValue = (value) => {
  savedValue.textContent = value || "暂无";
};

chrome.storage.local.get(["quickInput"], (result) => {
  if (result.quickInput) {
    updateSavedValue(result.quickInput);
  }
});

saveButton.addEventListener("click", () => {
  const value = inputField.value.trim();
  chrome.storage.local.set({ quickInput: value }, () => {
    updateSavedValue(value);
  });
});
