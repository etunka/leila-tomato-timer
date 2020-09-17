import "./styles.scss";

const timerSettings = {
  focus: 1500,
  shortBreak: 300,
  longBreak: 900
}

// remaining time - default 25 minutes
let time = timerSettings.focus;
let activeSetting = "focus";

let timerInterval = undefined;

const minutes = () => Math.floor(time / 60);
const seconds = () => time % 60;


const tick = new Audio("tick.mp3");
const bell = new Audio("bell.mp3");


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
}

function replayTimer() {
  clearInterval(timerInterval);
  createTimer(activeSetting);
  // start();
}

function start() {
  if(time > 0) {
    tick.play();

    timerInterval = setInterval(()=>startTimer(),1000);

    document.getElementById("done").classList.add("hidden");

    function startTimer() {
      time = time - 1;
      updateTimer();


      if (time === 0) {
        bell.play();
        clearInterval(timerInterval);
        document.getElementById("done").innerHTML = "Session completed!";
        document.getElementById("done").classList.remove("hidden");
      }
    }
  }
}

createTimer(activeSetting);
document
  .getElementById("focus")
  .addEventListener("click", (e) => createTimer(e.target.dataset.setting));
document
  .getElementById("short")
  .addEventListener("click", (e) => createTimer(e.target.dataset.setting));
document
  .getElementById("long")
  .addEventListener("click", (e) => createTimer(e.target.dataset.setting));

document.getElementById("play").addEventListener("click", () => start());
document.getElementById("pause").addEventListener("click", () => clearInterval(timerInterval));
document.getElementById("replay").addEventListener("click", () => replayTimer());

