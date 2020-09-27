// add zero pad
export function padDuration(duration) {
  return duration.toString().padStart(2, "0");
}

export function calculateMinutes(time) {
  return Math.floor(time / 60);
}
export function calculateSeconds(time) {
  return time % 60;
}

export function saveToLocalStorage(name, value) {
  localStorage.setItem(name, value);
}

export function getFromLocalStorage(name) {
  return localStorage.getItem(name);
}
