const socket = io();

/* ---------- Elements ---------- */
const loginScreen = document.getElementById("login-screen");
const chatScreen = document.getElementById("chat-screen");
const loginForm = document.getElementById("login-form");
const usernameInput = document.getElementById("username");
const roomInput = document.getElementById("room");
const roomOptions = document.getElementById("room-options");
const loginError = document.getElementById("login-error");

const roomList = document.getElementById("room-list");
const userList = document.getElementById("user-list");
const userCount = document.getElementById("user-count");
const leaveBtn = document.getElementById("leave-btn");

const roomTitle = document.getElementById("room-title");
const meLabel = document.getElementById("me-label");
const messagesEl = document.getElementById("messages");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");
const emojiToggle = document.getElementById("emoji-toggle");
const emojiBar = document.getElementById("emoji-bar");

/* ---------- State ---------- */
let me = null;
let currentRoom = null;
let unread = 0;
let latestRooms = [];
const baseTitle = document.title;

/* ---------- Helpers ---------- */
function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function scrollToBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// Each username gets a consistent colour
function nameColor(name) {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % 360;
  return `hsl(${hash}, 65%, 40%)`;
}

/* ---------- Rendering (textContent only, so no HTML injection) ---------- */
function renderRooms() {
  roomList.innerHTML = "";
  roomOptions.innerHTML = "";

  latestRooms.forEach(({ name, count }) => {
    const li = document.createElement("li");
    if (name === currentRoom) li.classList.add("active");

    const label = document.createElement("span");
    label.textContent = `# ${name}`;
    const badge = document.createElement("span");
    badge.className = "count";
    badge.textContent = count;
    li.append(label, badge);

    li.addEventListener("click", () => switchRoom(name));
    roomList.appendChild(li);

    const option = document.createElement("option");
    option.value = name;
    roomOptions.appendChild(option);
  });
}

function renderUsers(names) {
  userList.innerHTML = "";
  userCount.textContent = names.length;
  names.forEach((name) => {
    const li = document.createElement("li");
    li.textContent = name === me ? `${name} (you)` : name;
    userList.appendChild(li);
  });
}

function addMessage(msg) {
  const div = document.createElement("div");

  if (msg.system) {
    div.className = "system";
    div.textContent = msg.text;
  } else {
    div.className = "msg" + (msg.username === me ? " mine" : "");

    const meta = document.createElement("div");
    meta.className = "meta";
    const name = document.createElement("span");
    name.className = "name";
    name.textContent = msg.username;
    if (msg.username !== me) name.style.color = nameColor(msg.username);
    const time = document.createElement("span");
    time.className = "time";
    time.textContent = formatTime(msg.time);
    meta.append(name, time);

    const body = document.createElement("div");
    body.textContent = msg.text;

    div.append(meta, body);
  }

  messagesEl.appendChild(div);
  scrollToBottom();
}

/* ---------- Notifications ---------- */
let audioCtx = null;
function beep() {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.value = 660;
    gain.gain.value = 0.05;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  } catch {
    /* sound is optional */
  }
}

function notify(msg) {
  beep();
  if (document.hidden) {
    unread++;
    document.title = `(${unread}) New message - ${baseTitle}`;
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`${msg.username} in #${currentRoom}`, { body: msg.text });
    }
  }
}

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    unread = 0;
    document.title = baseTitle;
  }
});

/* ---------- Screens ---------- */
function showChat(data) {
  me = data.username;
  currentRoom = data.room;

  loginScreen.classList.add("hidden");
  chatScreen.classList.remove("hidden");
  roomTitle.textContent = `# ${currentRoom}`;
  meLabel.textContent = `Signed in as ${me}`;

  messagesEl.innerHTML = "";
  data.history.forEach(addMessage);
  renderRooms();
  messageInput.focus();
}

function showLogin() {
  me = null;
  currentRoom = null;
  chatScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");
  messagesEl.innerHTML = "";
  loginError.textContent = "";
  usernameInput.focus();
}

function switchRoom(room) {
  if (room === currentRoom) return;
  socket.emit("join", { username: me, room }, (res) => {
    if (!res.ok) return alert(res.error);
    showChat(res);
  });
}

/* ---------- Events: UI ---------- */
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  loginError.textContent = "";

  // Ask for notification permission on a user click
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }

  socket.emit(
    "join",
    { username: usernameInput.value, room: roomInput.value },
    (res) => {
      if (!res.ok) {
        loginError.textContent = res.error;
        return;
      }
      showChat(res);
    }
  );
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = messageInput.value.trim();
  if (!text) return;
  socket.emit("message", text);
  messageInput.value = "";
  messageInput.focus();
});

leaveBtn.addEventListener("click", () => {
  socket.emit("leave", () => showLogin());
});

// Emoji picker
["😀", "😂", "😍", "😎", "🤔", "😢", "😡", "👍", "👏", "🙏", "🎉", "🔥", "❤️", "💯", "🚀", "👀"].forEach(
  (emoji) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = emoji;
    btn.addEventListener("click", () => {
      messageInput.value += emoji;
      messageInput.focus();
    });
    emojiBar.appendChild(btn);
  }
);
emojiToggle.addEventListener("click", () => emojiBar.classList.toggle("hidden"));

/* ---------- Events: server ---------- */
socket.on("rooms", (rooms) => {
  latestRooms = rooms;
  renderRooms();
});

socket.on("users", renderUsers);

socket.on("message", (msg) => {
  addMessage(msg);
  if (!msg.system && msg.username !== me) notify(msg);
});

// If the server restarts, send the user back to the login screen
socket.on("disconnect", () => {
  if (me) {
    showLogin();
    loginError.textContent = "Disconnected from the server. Please join again.";
  }
});