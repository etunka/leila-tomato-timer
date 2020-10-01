import {
  createLog,
  updateLogInterface,
  saveLogToStorage,
  fetchLogFromStorage
} from "./log";
import { showNotification } from "./notification";
import { defaultLog, timerSettings, tick, bell } from "./constant";
import {
  padDuration,
  calculateMinutes,
  calculateSeconds,
  saveToLocalStorage,
  getFromLocalStorage
} from "./helper";

import "./styles.scss";

const savedLogInStorage = fetchLogFromStorage();

// remaining time - default 25 minutes
let time = timerSettings.focus;
let activeSetting = "focus";

let timerInterval = undefined;

const minutes = () => calculateMinutes(time);
const seconds = () => calculateSeconds(time);

// default site mode
let mode = getFromLocalStorage("mode") ? getFromLocalStorage("mode") : "light";

let savedLog = savedLogInStorage ? savedLogInStorage : defaultLog();

function createTimer(setting) {
  const duration = timerSettings[setting];
  // update time based on selected duration
  time = Number(duration);
  // we're setting current active setting of app when
  // new timer is created
  activeSetting = setting;
  // needs to stop any timer before creating a new one
  clearInterval(timerInterval);
  updateTimer();
}

function updateTimer() {
  document.getElementById("timer").innerHTML = `${padDuration(
    minutes()
  )}:${padDuration(seconds())}`;
  document.getElementById("title").innerHTML = `${padDuration(
    minutes()
  )}:${padDuration(seconds())}`;
  document.getElementById("done").classList.add("hidden");
}

function replayTimer() {
  clearInterval(timerInterval);
  createTimer(activeSetting);
}

function updateButtonStyle(id) {
  document
    .querySelectorAll(".durations__button")
    .forEach((el) => el.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function toggleMode() {
  applyMode(mode === "dark" ? "light" : "dark");
}

function applyMode(colorMode) {
  mode = colorMode;
  if (colorMode === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }

  document.getElementById("mode").innerHTML = `${
    colorMode === "dark" ? "light" : "dark"
  } mode`;
  saveToLocalStorage("mode", colorMode);
}

function clearLog() {
  setLog(defaultLog());

  updateLogInterface();

  saveLogToStorage();
}

function start() {
  if (time > 0) {
    tick.play();
    Notification.requestPermission();
    timerInterval = setInterval(() => startTimer(), 1000);
    document.getElementById("done").classList.add("hidden");

    function startTimer() {
      time = time - 1;
      updateTimer();

      if (time === 0) {
        bell.play();
        clearInterval(timerInterval);
        document.getElementById("done").innerHTML =
          activeSetting === "focus"
            ? `Session completed!`
            : `End of the break!`;
        document.getElementById("done").classList.remove("hidden");
        // desktop notification
        if (Notification.permission === "granted") {
          showNotification();
        }
      }
    }
  }
}

export function getLog() {
  return savedLog;
}

export function setLog(newLog) {
  savedLog = newLog;
}

// Event handlers
document.getElementById("title").innerHTML = `Leila Tomato Timer`;
document.getElementById("focus").addEventListener("click", (e) => {
  createTimer(e.target.dataset.setting);
  updateButtonStyle("focus");
});
document.getElementById("short").addEventListener("click", (e) => {
  createTimer(e.target.dataset.setting);
  updateButtonStyle("short");
});
document.getElementById("long").addEventListener("click", (e) => {
  createTimer(e.target.dataset.setting);
  updateButtonStyle("long");
});
document.getElementById("play").addEventListener("click", () => start());
document
  .getElementById("pause")
  .addEventListener("click", () => clearInterval(timerInterval));
document
  .getElementById("replay")
  .addEventListener("click", () => replayTimer());
document.getElementById("mode").addEventListener("click", () => toggleMode());
document.getElementById("clear").addEventListener("click", () => clearLog());

// Initiate the app
createTimer(activeSetting);
applyMode(mode);
createLog(savedLog);
