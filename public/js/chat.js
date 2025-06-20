
const socket = io(window.location.origin);
const user = JSON.parse(localStorage.getItem("user"));

document.getElementById("chat-avatar").src = user.avatar;
document.getElementById("chat-username").textContent = user.username;

socket.on("load-messages", (messages) => {
  messages.forEach(displayMessage);
});

socket.on("chat-message", displayMessage);

function displayMessage(data) {
  const div = document.createElement("div");
  div.classList.add("message", "chat-message");
  div.classList.add(data.username === user.username ? "sent" : "received");

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.textContent = data.message;

  div.appendChild(bubble);
  document.getElementById("messages").appendChild(div);
  document.getElementById("messages").scrollTop = document.getElementById("messages").scrollHeight;
}

document.getElementById("chat-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("message-input");
  const msg = input.value.trim();
  if (!msg) return;

  const data = { username: user.username, avatar: user.avatar, message: msg };
  displayMessage(data);
  socket.emit("chat-message", data);
  input.value = "";
});


document.getElementById("toggle-theme").addEventListener("click", () => {
  document.getElementById("chatContainer").classList.toggle("light-theme");
});


// document.querySelector(".emoji-picker-icon").addEventListener("click", () => {
//   alert("Press your system shortcut (e.g., Windows + .) to open the emoji picker.");
// });



document.addEventListener("DOMContentLoaded", () => {
  const picker = new EmojiButton();
  const trigger = document.querySelector(".emoji-picker-icon");
  const input = document.getElementById("message-input");

  trigger.addEventListener("click", () => {
    picker.togglePicker(trigger);
  });

  picker.on("emoji", emoji => {
    input.value += emoji;
    input.focus();
  });
});
