import "./styles.scss";
const tickFile  =  require("./tick.mp3")
const bellFile =  require("./bell.mp3")

const timerSettings = {
  focus: 1500,
  shortBreak: 300,
  longBreak: 1200
}

const defaultLog = [
  [false,false,false,false],
  [false,false,false,false],
  [false,false,false,false],
  [false,false,false,false]
];

const savedLogInStorage = fetchLogFromStorage()

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

function updateLogInterface(log){
  for(let colIndex = 0; colIndex < log.length; colIndex++) {

    const column = log[colIndex];
    for(let iconIndex = 0; iconIndex < column.length; iconIndex++) {
      const icon = document.getElementById(`icon-${colIndex}-${iconIndex}`);

      if(!icon) {
        continue;
      }

      if(log[colIndex][iconIndex]) {
        icon.classList.add("checked");
      } else {
        icon.classList.remove("checked");
      }
    }
  }
}

function saveLogToStorage(log) {
  localStorage.setItem('savedLog', JSON.stringify(log));
}


function fetchLogFromStorage() {
  return JSON.parse(localStorage.getItem('savedLog'));
}

function createLog() {
  const iconStr = `<img class="log__icon" src="https://leila-tomato-timer.netlify.app/tomato-logo.f4e16dd2.png" alt="tomato logo"/>`
  const icon = (colIndex,iconIndex) => {
    // convert string(tomato icon) to DOM
    const el = document.createRange().createContextualFragment(iconStr).firstChild

    el.id = `icon-${colIndex}-${iconIndex}`;

    el.addEventListener("click", (e) => {
        savedLog[colIndex][iconIndex] = !savedLog[colIndex][iconIndex];

        updateLogInterface(savedLog);
        saveLogToStorage(savedLog);
    })

    return el;
  }

  const createColumn = () => {
    const col = document.createElement("div")
    col.classList.add("log__column");
    return col;
  };

  for(let colIndex = 0; colIndex < 4; colIndex++) {
    const column = createColumn();
    // add icon 4 times
    for(let iconIndex = 0; iconIndex < 4; iconIndex++) {
      column.appendChild(icon(colIndex,iconIndex));
    }
    document.getElementById("logWrapper").appendChild(column);
  }

  updateLogInterface(savedLog);
}

function clearLog() {
  savedLog = defaultLog;
  updateLogInterface(savedLog);
  saveLogToStorage(savedLog);
}

function showNotification() {
  const notification = new Notification("New message from Leila", {
    body: "Time's up!",
    icon: "https://leila-tomato-timer.netlify.app/tomato-logo.f4e16dd2.png"
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
createLog();


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
// document.querySelectorAll(".log__icon").forEach(el => el.addEventListener("click", (e) => {
//   e.target.classList.toggle("checked");
//   localStorage.setItem("isChecked", localStorage.getItem("isChecked", true) ? false : true);
// }));
document.getElementById("clear").addEventListener("click", () => clearLog());








