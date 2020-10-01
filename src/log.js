import tomatoLogo from "./images/tomato-logo.png";
import { getLog, setLog } from "./index";
import { saveToLocalStorage, getFromLocalStorage } from "./helper";
import { defaultLog } from "./constant";

export function updateLogInterface() {
  const log = getLog();
  for (let colIndex = 0; colIndex < log.length; colIndex++) {
    const column = log[colIndex];
    for (let iconIndex = 0; iconIndex < column.length; iconIndex++) {
      const icon = document.getElementById(`icon-${colIndex}-${iconIndex}`);

      if (!icon) {
        continue;
      }

      if (log[colIndex][iconIndex]) {
        icon.classList.add("checked");
      } else {
        icon.classList.remove("checked");
      }
    }
  }
}

function handleLogClick(colIndex, iconIndex) {
  let log = getLog();
  log[colIndex][iconIndex] = !log[colIndex][iconIndex];
  setLog(log);

  updateLogInterface();
  saveLogToStorage();
}

export function createLog(savedLog) {
  const iconStr = `<img class="log__icon" src="${tomatoLogo}" alt="tomato logo"/>`;
  const icon = (colIndex, iconIndex) => {
    // convert string(tomato icon) to DOM
    const el = document.createRange().createContextualFragment(iconStr)
      .firstChild;

    el.id = `icon-${colIndex}-${iconIndex}`;

    el.addEventListener("click", (e) => {
      handleLogClick(colIndex, iconIndex);
    });

    return el;
  };

  const createColumn = () => {
    const col = document.createElement("div");
    col.classList.add("log__column");
    return col;
  };

  for (let colIndex = 0; colIndex < 4; colIndex++) {
    const column = createColumn();
    // add icon 4 times
    for (let iconIndex = 0; iconIndex < 4; iconIndex++) {
      column.appendChild(icon(colIndex, iconIndex));
    }
    document.getElementById("logWrapper").appendChild(column);
  }

  updateLogInterface();
}

export function saveLogToStorage() {
  const log = getLog();
  saveToLocalStorage("savedLog", JSON.stringify(log));
}

export function fetchLogFromStorage() {
  return JSON.parse(getFromLocalStorage("savedLog"));
}
