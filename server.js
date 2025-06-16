const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Gửi tin nhắn cho tất cả client
function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Lắng nghe kết nối
wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    const data = JSON.parse(message);
    data.timestamp = new Date().toLocaleTimeString();
    broadcast(data);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

app.use(express.static(path.join(__dirname, "public")));

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
