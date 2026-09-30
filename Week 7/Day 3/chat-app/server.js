const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

/* ---------- State (in memory) ---------- */

const DEFAULT_ROOMS = ["General", "Random", "Tech"];
const MAX_HISTORY = 50;
const NAME_PATTERN = /^[\w .-]{2,20}$/;

const users = new Map(); // socket.id -> { username, room }
const history = new Map(); // room -> [message, ...]

/* ---------- Helpers ---------- */

function usersIn(room) {
  return [...users.values()]
    .filter((u) => u.room === room)
    .map((u) => u.username)
    .sort((a, b) => a.localeCompare(b));
}

// Default rooms always exist; custom rooms exist while someone is in them
function getRoomList() {
  const counts = {};
  DEFAULT_ROOMS.forEach((r) => (counts[r] = 0));
  for (const u of users.values()) {
    if (u.room) counts[u.room] = (counts[u.room] || 0) + 1;
  }
  return Object.entries(counts).map(([name, count]) => ({ name, count }));
}

function systemMessage(room, text) {
  io.to(room).emit("message", { system: true, text, time: Date.now() });
}

function leaveRoom(socket) {
  const user = users.get(socket.id);
  if (!user || !user.room) return;

  const room = user.room;
  socket.leave(room);
  user.room = null;

  systemMessage(room, `${user.username} left the room`);
  io.to(room).emit("users", usersIn(room));

  // Forget history of custom rooms once they are empty
  if (!DEFAULT_ROOMS.includes(room) && usersIn(room).length === 0) {
    history.delete(room);
  }
  io.emit("rooms", getRoomList());
}

/* ---------- Socket events ---------- */

io.on("connection", (socket) => {
  // Lets the login screen show the current rooms
  socket.emit("rooms", getRoomList());

  // Join (or switch to) a room. Also registers the username on first join.
  socket.on("join", (data, ack) => {
    if (typeof ack !== "function") return;

    const existing = users.get(socket.id);
    const username = existing ? existing.username : String(data?.username ?? "").trim();
    const room = String(data?.room ?? "").trim();

    if (!NAME_PATTERN.test(username)) {
      return ack({
        ok: false,
        error: "Username must be 2-20 characters (letters, numbers, spaces, _ . -)",
      });
    }
    if (!NAME_PATTERN.test(room)) {
      return ack({
        ok: false,
        error: "Room name must be 2-20 characters (letters, numbers, spaces, _ . -)",
      });
    }

    // Username must be unique across the server
    const taken = [...users.entries()].some(
      ([id, u]) => id !== socket.id && u.username.toLowerCase() === username.toLowerCase()
    );
    if (taken) return ack({ ok: false, error: `"${username}" is already taken` });

    if (existing && existing.room === room) {
      return ack({ ok: false, error: "You are already in that room" });
    }

    // Leave the previous room (if any), then join the new one
    if (existing) leaveRoom(socket);
    users.set(socket.id, { username, room });
    socket.join(room);

    ack({ ok: true, username, room, history: history.get(room) || [] });

    systemMessage(room, `${username} joined the room`);
    io.to(room).emit("users", usersIn(room));
    io.emit("rooms", getRoomList());
  });

  // Leave the room and free up the username
  socket.on("leave", (ack) => {
    leaveRoom(socket);
    users.delete(socket.id);
    if (typeof ack === "function") ack({ ok: true });
  });

  // Chat message to the user's current room
  socket.on("message", (text) => {
    const user = users.get(socket.id);
    if (!user || !user.room) return;

    const clean = String(text ?? "").trim().slice(0, 500);
    if (!clean) return;

    const msg = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      username: user.username,
      text: clean,
      time: Date.now(),
    };

    if (!history.has(user.room)) history.set(user.room, []);
    const roomHistory = history.get(user.room);
    roomHistory.push(msg);
    if (roomHistory.length > MAX_HISTORY) roomHistory.shift();

    io.to(user.room).emit("message", msg);
  });

  socket.on("disconnect", () => {
    leaveRoom(socket);
    users.delete(socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Chat app running on http://localhost:${PORT}`);
});