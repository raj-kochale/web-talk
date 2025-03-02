import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });
const rooms = new Map<string, Set<WebSocket>>();
const users = new Map<WebSocket, { username: string; room: string | null }>();

wss.on("connection", (socket) => {
  console.log("user connected");

  socket.on("message", (data) => {
    const message = data.toString();

    if (message.startsWith("join:")) {
      const [_, username, room] = message.split(":");
      users.set(socket, { username, room });
      if (!rooms.has(room)) {
        rooms.set(room, new Set());
      }
      rooms.get(room)?.add(socket);

      // Broadcast Users List to Everyone in Room
      broadcast(room, `users:${JSON.stringify([...rooms.get(room)!].map((s) => users.get(s)?.username))}`);
      console.log(`${username} joined ${room}`);
    } 
    
    else if (message === "typing") {
      const user = users.get(socket);
      if (user && user.room) {
        broadcast(user.room, `typing:${user.username}`);
      }
    }
    
    else {
      const user = users.get(socket);
      if (user && user.room) {
        console.log(`${user.username} in ${user.room} says:`, message);
        broadcast(user.room, `${user.username}: ${message}`);
      }
    }
  });

  socket.on("close", () => {
    const user = users.get(socket);
    if (user?.room) {
      rooms.get(user.room)?.delete(socket);
      broadcast(user.room, `users:${JSON.stringify([...rooms.get(user.room)!].map((s) => users.get(s)?.username))}`);
    }
    console.log("user disconnected");
  });
});

function broadcast(room: string, message: string) {
  rooms.get(room)?.forEach((client) => client.send(message));
}
