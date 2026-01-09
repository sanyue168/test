# Quick Input Popup Chrome Extension

这个示例是一个简易的 Chrome 插件，点击工具栏图标后会弹出类似 MetaMask 的小窗口，方便输入并加密保存一段文字。

## 使用方式

1. 打开 Chrome，进入 `chrome://extensions/`。
2. 打开右上角「开发者模式」。
3. 点击「加载已解压的扩展程序」，选择本项目目录。
4. 点击插件图标即可看到弹窗，输入内容与口令后点击「加密并保存」。
5. 输入相同口令并点击「解密查看」即可看到已保存的内容。

保存的内容会通过 `AES-GCM + PBKDF2` 加密后存储在 `chrome.storage.local` 中。
