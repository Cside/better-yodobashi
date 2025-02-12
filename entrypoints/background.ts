export default defineBackground(() => {
  chrome.runtime.onInstalled.addListener(async ({ reason }) => {
    if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
      // await chrome.action.openPopup(); // TODO なぜかクラッシュする。。
      await chrome.runtime.openOptionsPage();
    }
  });
});
