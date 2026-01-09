# Quick Input Popup Chrome Extension

这个示例是一个简易的 Chrome 插件，点击工具栏图标后会弹出类似 MetaMask 的小窗口，方便输入私钥并生成对应地址。

## 使用方式

1. 打开 Chrome，进入 `chrome://extensions/`。
2. 打开右上角「开发者模式」。
3. 点击「加载已解压的扩展程序」，选择本项目目录。
4. 点击插件图标即可看到弹窗，输入私钥并点击「保存并生成地址」。

插件会使用 `ethers.js` 解析私钥并生成地址，然后把私钥与地址保存到 `chrome.storage.local`。

> 注意：私钥保存到浏览器本地，请仅用于测试或个人用途。
