import "./styles.scss";

let time = 1500;
const minutes = () => Math.floor(time / 60);
const seconds = () => time % 60;

let timerInterval = undefined;

const tick = new Audio("tick.mp3");
const bell = new Audio("bell.mp3");

console.log(tick)

function createTimer(duration = 1500) {
  time = Number(duration);
  clearInterval(timerInterval);
  updateTimer();
}
// add zero pad
function padDuration(duration) {
  return duration.toString().padStart(2, "0");
}

function updateTimer() {
  document.getElementById("timer").innerHTML = `${padDuration(
    minutes()
  )}:${padDuration(seconds())}`;
}

function start() {
  tick.play();

  timerInterval = setInterval(()=>startTimer(),10);

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

createTimer();
document
  .getElementById("focus")
  .addEventListener("click", (e) => createTimer(e.target.dataset.duration));
document
  .getElementById("short")
  .addEventListener("click", (e) => createTimer(e.target.dataset.duration));
document
  .getElementById("long")
  .addEventListener("click", (e) => createTimer(e.target.dataset.duration));
document.getElementById("play").addEventListener("click", () => start());
