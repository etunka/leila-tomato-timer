export const timerSettings = {
  focus: 1500,
  shortBreak: 300,
  longBreak: 1200
}

export const defaultLog = [
  [false,false,false,false],
  [false,false,false,false],
  [false,false,false,false],
  [false,false,false,false]
];

const tickFile  =  require("./tick.mp3")
export const tick = new Audio(tickFile);

const bellFile =  require("./bell.mp3")
export const bell = new Audio(bellFile);
