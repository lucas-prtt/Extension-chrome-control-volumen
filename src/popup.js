const slider = document.getElementById("volumeSlider");
(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.runtime.sendMessage({ action: "initAudio", tabId: tab.id});
  
  slider.addEventListener("input", async () => {
    chrome.runtime.sendMessage({
      action: "setVolume",
      tabId: tab.id,
      value: slider.value
    });
  });

})()
