const audioContexts = {};  // tabId -> { audioContext, gainNode, volume }

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.action === "initAudio") {
    const tabId = msg.tabId
    const streamId = msg.streamId

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: "tab",
          chromeMediaSourceId: streamId
        }
      },
      video: false
    });

    audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    gainNode = audioContext.createGain();
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    audioContexts[tabId] = { audioContext, gainNode, volume: 1};
    console.log(`AudioContext activo para tab ${tabId}`);


} else if (msg.action === "setVolume") {
    const tabId = msg.tabId;
    if (audioContexts[tabId]) {
      audioContexts[tabId].gainNode.gain.value = msg.value;
      audioContexts[tabId].volume = msg.value
    }  
} else if (msg.action == "removeTab") {
    const tabId = msg.tabId;
    if (audioContexts[tabId]) {
      audioContexts[tabId].gainNode.disconnect();
      audioContexts[tabId].audioContext.close();
      delete audioContexts[tabId];
      console.log(`AudioContext de tab ${tabId} eliminado`);
    }
} else if (msg.action === "getVolume") {
    tabId = msg.tabId
    const vol = audioContexts[tabId]?.volume ?? 1;
    sendResponse({ volume: vol });
    return true
  }

});