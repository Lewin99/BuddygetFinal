import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const clients = new Map();

const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws, req) => {
  const token = new URLSearchParams(req.url.split("?")[1]).get("token");
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET_key);
  } catch (error) {
    console.error("Invalid token");
    ws.close();
    return;
  }
  const userId = decoded.userId;
  clients.set(userId, ws);

  ws.on("close", () => {
    clients.delete(userId);
  });
});

export const handleUpgrade = (server) => {
  server.on("upgrade", (req, socket, head) => {
    const token = new URLSearchParams(req.url.split("?")[1]).get("token");
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.SECRET_key);
    } catch (error) {
      socket.destroy();
      return;
    }
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  });
};

export const notifyUser = (userId, message) => {
  const client = clients.get(userId);
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify({ message }));
  }
};
