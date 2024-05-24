chrome.action.onClicked.addListener(async (tab) => {
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['src/contentScript.js']
    });
  } catch (e) {
    console.error('Script injection failed: ', e);
  }
});
