const sliderVolume = document.getElementById("volumeSlider");
const sliderThreshold = document.getElementById("thresholdSlider");
const sliderRatio = document.getElementById("ratioSlider");
const sliderAttack = document.getElementById("attackSlider");
const sliderRelease = document.getElementById("releaseSlider");
const toggle = document.getElementById("compressorToggle");
const compressorControls = document.getElementById("compressorControls");
function getSettings(tabId) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: "getSettings", tabId }, (response) => {
      resolve(response);
    });
  });
}
(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.runtime.sendMessage({ action: "initAudio", tabId: tab.id });
  const initialSettings = await getSettings(tab.id);
  console.log(initialSettings);
  const sliders = ["volume", "threshold", "ratio", "attack", "release"];
  if (initialSettings) {
    toggle.checked = initialSettings.compressorEnabled;
    compressorControls.classList.toggle(
      "disabled",
      !initialSettings.compressorEnabled,
    );
  }
  sliders.forEach((name) => {
    const slider = document.getElementById(name + "Slider");
    const value = document.getElementById(name + "Value");
    if (initialSettings) {
      slider.value = initialSettings[name];
      value.textContent = slider.value;
    }
    slider.addEventListener("input", () => {
      value.textContent = slider.value;
      chrome.runtime.sendMessage({
        action: "setSettings",
        tabId: tab.id,
        [name]: slider.value,
      });
    });
  });
  toggle.addEventListener("change", () => {
    compressorControls.classList.toggle("disabled", !toggle.checked);

    chrome.runtime.sendMessage({
      action: "setSettings",
      tabId: tab.id,
      compressorEnabled: toggle.checked,
    });
  });
})();
