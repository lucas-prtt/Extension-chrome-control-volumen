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

chrome.runtime.onMessage.addListener(async (msg) => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (msg.action === "initAudio") {
    await ensureOffscreen();

    chrome.tabCapture.getMediaStreamId({ targetTabId: tab.id }, (streamId) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      chrome.runtime.sendMessage({ action: "initAudio", streamId });
    });
  } else if (msg.action === "setVolume") {
    chrome.runtime.sendMessage(msg);
  }
});