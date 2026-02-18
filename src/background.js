async function ensureOffscreen() {
  const offscreenExists = await chrome.offscreen.hasDocument();
  if (!offscreenExists) {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['USER_MEDIA'],
      justification: 'Necesitamos capturar audio de la pestaña'
    });
  }
}

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.action === "initAudio") {
    await ensureOffscreen();

    chrome.tabCapture.getMediaStreamId({ targetTabId: msg.tabId }, (streamId) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      chrome.runtime.sendMessage({ action: "initAudio", streamId: streamId, tabId : msg.tabId});
    });
  } else if (msg.action === "setVolume") {
    chrome.runtime.sendMessage(msg);
  } else if (msg.action === "getVolume") {
    chrome.runtime.sendMessage(msg, (response) => sendResponse(response));
    return true
  }
});
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  chrome.runtime.sendMessage({ action: "removeTab", tabId });
});