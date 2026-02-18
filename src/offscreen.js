let audioContext;
let gainNode;

chrome.runtime.onMessage.addListener(async (msg) => {
  if (msg.action === "initAudio") {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: "tab",
          chromeMediaSourceId: msg.streamId
        }
      },
      video: false
    });

    audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    gainNode = audioContext.createGain();
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);

    console.log("AudioContext activo en offscreen document");
  } else if (msg.action === "setVolume" && gainNode) {
    gainNode.gain.value = parseFloat(msg.value);
  }
});