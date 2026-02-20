const audioContexts = {}; // tabId -> { audioContext, gainNode, compressor, settings }

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.action === "initAudio") {
    const tabId = msg.tabId;
    const streamId = msg.streamId;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: "tab",
          chromeMediaSourceId: streamId,
        },
      },
      video: false,
    });

    audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    gainNode = audioContext.createGain();
    compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.value = -30;
    compressor.knee.value = 0;
    compressor.ratio.value = 20;
    compressor.attack.value = 0.001;
    compressor.release.value = 0.05;
    
    setInterval(() => {
      console.log(";;;;;;;;;;;;;;;;;;;;;;;")
      console.log(compressor.reduction);
      console.log(compressor.threshold.value)
      console.log(compressor.ratio.value)
      console.log(compressor.knee.value)
      console.log(compressor.attack.value)
      console.log(compressor.release.value)
      console.log("::::::::::::::::::::::::::")
    }, 1000);
    
    source.connect(gainNode);
    gainNode.connect(compressor);
    compressor.connect(audioContext.destination);

    audioContexts[tabId] = { audioContext, gainNode, compressor, settings:{volume: 1, ratio: 20, threshold : -30, attack:0.001, release:0.05}};
    console.log(`AudioContext activo para tab ${tabId}`);
  } else if (msg.action === "setSettings") {
    const tabId = msg.tabId;
    const gn = audioContexts[tabId].gainNode
    const cmp = audioContexts[tabId].compressor
    const sett = audioContexts[tabId].settings
    if (audioContexts[tabId]) {
      if(msg.volume !== undefined){
        sett.volume = msg.volume;
        gn.gain.value = msg.volume;
      }
      if(msg.ratio !== undefined ){
        sett.ratio = msg.ratio;
        cmp.ratio.value = msg.ratio
      }
      if(msg.threshold !== undefined ){
        sett.threshold = msg.threshold;
        cmp.threshold.value = msg.threshold
      }
      if(msg.attack !== undefined ){
        sett.attack = msg.attack;
        cmp.attack.value = msg.attack
      }
      if(msg.release !== undefined ){
        sett.release = msg.release;
        cmp.release.value = msg.release
      }
    }
  } else if (msg.action == "removeTab") {
    const tabId = msg.tabId;
    if (audioContexts[tabId]) {
      audioContexts[tabId].gainNode.disconnect();
      audioContexts[tabId].audioContext.close();
      delete audioContexts[tabId];
      console.log(`AudioContext de tab ${tabId} eliminado`);
    }
  } else if (msg.action === "getSettings") {
    tabId = msg.tabId;
    const sett = audioContexts[tabId].settings;
    sendResponse(sett);
    return true;
  }
});
