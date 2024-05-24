chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.url.startsWith('chrome://')) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['src/contentScript.js']
      });
    } catch (e) {
      console.error('Script injection failed: ', e);
    }
  } else {
    console.warn('Cannot run script on chrome:// URLs');
  }
});
