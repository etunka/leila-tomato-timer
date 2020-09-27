export function showNotification() {
  const notification = new Notification("New message from Leila", {
    body: "Time's up!",
    icon: tomatoLogo
  })

  notification.onclick = (e) => {
    window.location.href = "https://leila-tomato-timer.netlify.app/";
  }
}
