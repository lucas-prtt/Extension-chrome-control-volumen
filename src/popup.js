const slider = document.getElementById("volumeSlider");
(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.runtime.sendMessage({ action: "initAudio"});
  
  slider.addEventListener("input", async () => {
    chrome.runtime.sendMessage({
      action: "setVolume",
      value: slider.value
    });
  });

})()
