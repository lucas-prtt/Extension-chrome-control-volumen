(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabCapture.getMediaStreamId({ targetTabId: tab.id }, (streamId) => {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError);
    }
    console.log(streamId);

    const stream = navigator.mediaDevices
      .getUserMedia({
        audio: {
          mandatory: {
            chromeMediaSource: "tab",
            chromeMediaSourceId: streamId,
          },
        },
        video: false,
      })
      .then((stream) => {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const gainNode = audioContext.createGain();
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        window.gainNode = gainNode;
      });
  });
})();

const slider = document.getElementById("volumeSlider");

slider.addEventListener("input", () => {
  if (window.gainNode) {
    window.gainNode.gain.value = parseFloat(slider.value);
  }
});
