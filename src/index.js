import "./styles.scss";
const tickFile  =  require("./tick.mp3")
const bellFile =  require("./bell.mp3")


const timerSettings = {
  focus: 1500,
  shortBreak: 300,
  longBreak: 900
}

// remaining time - default 25 minutes
let time = timerSettings.focus;
let activeSetting = "focus";

let timerInterval = undefined;

// default site mode
let mode = "light";

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
  if(mode === "light") {
    mode = "dark";
    document.body.classList.add("dark");
    document.getElementById("mode").innerHTML = "Light mode"
  }

  else if(mode === "dark") {
    mode = "light";
    document.body.classList.remove("dark");
    document.getElementById("mode").innerHTML = "Dark mode"
  }
}

function start() {
  if(time > 0) {
    tick.play();

    timerInterval = setInterval(()=>startTimer(),10);

    document.getElementById("done").classList.add("hidden");

    function startTimer() {
      time = time - 1;
      updateTimer();


      if (time === 0) {
        bell.play();
        clearInterval(timerInterval);
        document.getElementById("done").innerHTML = activeSetting === "focus" ? `Session completed!` : `End of the break!`;
        document.getElementById("done").classList.remove("hidden");
      }
    }
  }
}

createTimer(activeSetting);
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

