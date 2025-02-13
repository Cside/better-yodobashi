export default defineBackground(() => {
  chrome.runtime.onInstalled.addListener(async ({ reason }) => {
    if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
      // await chrome.action.openPopup(); // TODO クラッシュしなくなったけど、怖いから一応やめておく
      await chrome.runtime.openOptionsPage();
    }
  });

  chrome.action.onClicked.addListener(
    async () => await chrome.runtime.openOptionsPage()
  );
});
