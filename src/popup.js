const sliderVolume = document.getElementById("volumeSlider");
const sliderThreshold = document.getElementById("thresholdSlider");
const sliderRatio = document.getElementById("ratioSlider");
const sliderAttack = document.getElementById("attackSlider");
const sliderRelease = document.getElementById("releaseSlider");

(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.runtime.sendMessage({ action: "initAudio", tabId: tab.id });

  chrome.runtime.sendMessage(
    { action: "getSettings", tabId: tab.id },
    (response) => {
      sliderVolume.value = response.volume;
      sliderRatio.value = response.ratio
      sliderThreshold.value = response.threshold
      sliderAttack.value = response.attack
      sliderRelease.value = response.release
    },
  );

  sliderVolume.addEventListener("input", async () => {
    chrome.runtime.sendMessage({
      action: "setSettings",
      tabId: tab.id,
      volume: sliderVolume.value,
    });
  });
    sliderThreshold.addEventListener("input", async () => {
    chrome.runtime.sendMessage({
      action: "setSettings",
      tabId: tab.id,
      threshold: sliderThreshold.value,
    });
  });
    sliderRatio.addEventListener("input", async () => {
    chrome.runtime.sendMessage({
      action: "setSettings",
      tabId: tab.id,
      ratio: sliderRatio.value,
    });
  });
    sliderAttack.addEventListener("input", async () => {
    chrome.runtime.sendMessage({
      action: "setSettings",
      tabId: tab.id,
      attack: sliderAttack.value,
    });
  });
    sliderRelease.addEventListener("input", async () => {
    chrome.runtime.sendMessage({
      action: "setSettings",
      tabId: tab.id,
      release: sliderRelease.value,
    });
  });
})();
