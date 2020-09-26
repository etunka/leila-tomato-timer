import {  createLog, updateLogInterface, saveLogToStorage, fetchLogFromStorage } from './log';
import { defaultLog, timerSettings } from './constant';
import "./styles.scss";
import tomatoLogo from  "./tomato-logo.png";
const tickFile  =  require("./tick.mp3")
const bellFile =  require("./bell.mp3")

const savedLogInStorage = fetchLogFromStorage();

// remaining time - default 25 minutes
let time = timerSettings.focus;
let activeSetting = "focus";

let timerInterval = undefined;

// default site mode
let mode = localStorage.getItem("mode") ? localStorage.getItem("mode") : "light";

let savedLog = savedLogInStorage ? savedLogInStorage : defaultLog;

const minutes = () => Math.floor(time / 60);
const seconds = () => time % 60;

const tick = new Audio(tickFile);
const bell = new Audio(bellFile);


function createTimer(setting) {
  const duration = timerSettings[setting]
  // update time based on selected duration
  time = Number(duration);
  // we're setting current active setting of app when
  // new timer is created
  activeSetting = setting;
  // needs to stop any timer before creating a new one
  clearInterval(timerInterval);
  updateTimer();
}

// add zero pad
function padDuration(duration) {
  return duration.toString().padStart(2, "0");
}

function updateTimer() {
  document.getElementById("timer").innerHTML = `${padDuration(minutes())}:${padDuration(seconds())}`;
  document.getElementById("title").innerHTML = `${padDuration(minutes())}:${padDuration(seconds())}`;
  document.getElementById("done").classList.add("hidden");
}

function replayTimer() {
  clearInterval(timerInterval);
  createTimer(activeSetting);
}

function updateButtonStyle(id) {
  document.querySelectorAll(".durations__button").forEach(el => el.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function toggleMode() {
  applyMode(mode === "dark" ? "light" : "dark");
}

function applyMode(colorMode) {
    mode = colorMode;
    if (colorMode === "dark") {
      document.body.classList.add("dark");
    }
    else {
      document.body.classList.remove("dark");
    }

    document.getElementById("mode").innerHTML = `${colorMode === "dark" ? "light" : "dark"} mode`;
    localStorage.setItem("mode", colorMode);
}

function clearLog() {
  savedLog = defaultLog;
  updateLogInterface(savedLog);
  saveLogToStorage(savedLog);
}

function showNotification() {
  const notification = new Notification("New message from Leila", {
    body: "Time's up!",
    icon: tomatoLogo
  })

  notification.onclick = (e) => {
    window.location.href = "https://leila-tomato-timer.netlify.app/";
  }
}

function start() {
  if (time > 0) {
    tick.play();
    Notification.requestPermission();
    timerInterval = setInterval(()=>startTimer(),1000);
    document.getElementById("done").classList.add("hidden");

    function startTimer() {
      time = time - 1;
      updateTimer();


      if (time === 0) {
        bell.play();
        clearInterval(timerInterval);
        document.getElementById("done").innerHTML = activeSetting === "focus" ? `Session completed!` : `End of the break!`;
        document.getElementById("done").classList.remove("hidden");
        // desktop notification
        if (Notification.permission === "granted") {
          showNotification();
        }
      }
    }
  }
}

createTimer(activeSetting);
applyMode(mode);
createLog(savedLog);


// Event handlers
document.getElementById("title").innerHTML = `Leila Tomato Timer`;
document
  .getElementById("focus")
  .addEventListener("click", (e) => {
    createTimer(e.target.dataset.setting);
    updateButtonStyle("focus");
  });
document
  .getElementById("short")
  .addEventListener("click", (e) => {
    createTimer(e.target.dataset.setting);
    updateButtonStyle("short");
  });
document
  .getElementById("long")
  .addEventListener("click", (e) => {
    createTimer(e.target.dataset.setting);
    updateButtonStyle("long");
  });
document.getElementById("play").addEventListener("click", () => start());
document.getElementById("pause").addEventListener("click", () => clearInterval(timerInterval));
document.getElementById("replay").addEventListener("click", () => replayTimer());
document.getElementById("mode").addEventListener("click", () => toggleMode());
document.getElementById("clear").addEventListener("click", () => clearLog());








