import tomatoLogo from  "./images/tomato-logo.png";
import { saveToLocalStorage, getFromLocalStorage } from './helper';

export function updateLogInterface(log){
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

export function createLog(savedLog) {
  const iconStr = `<img class="log__icon" src="${tomatoLogo}" alt="tomato logo"/>`
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

export function saveLogToStorage(log) {
  saveToLocalStorage('savedLog', JSON.stringify(log));
}


export function fetchLogFromStorage() {
  return JSON.parse(getFromLocalStorage('savedLog'));
}
