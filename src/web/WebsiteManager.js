const config = require("../../config.json");
const { webMessage } = require("../Logger.js");
const WebSocket = require("ws");
const http = require("http");

class WebServer {
  constructor(bot) {
    this.bot = bot;
    this.port = config.web.port;
    this.start = Date.now();
  }

  async connect() {
    if (config.web.enabled === false) return;

    const server = http.createServer();
    const wss = new WebSocket.Server({ noServer: true });

    wss.on("connection", (ws) => {
      webMessage("Client has connected to the server.");
      ws.on("message", (message) => {
        message = JSON.parse(message);
        if (typeof message !== "object") {
          return;
        }

        if (message.type === "message" && message.token === config.web.token && message.data) {
          webMessage(`Received: ${JSON.stringify(message)}`);
          bot.chat(message.data);
        }
      });

      bot.on("message", (message) => {
        ws.send(JSON.stringify(message));
      });
    });

    server.on("upgrade", (request, socket, head) => {
      if (request.url === "/message") {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit("connection", ws, request);
        });
      }
    });

    server.listen(this.port, () => {
      webMessage(`WebSocket running at http://localhost:${this.port}/`);
    });

    server.on("request", (req, res) => {
      if (req.url === "/uptime") {
        res.end(
          JSON.stringify({
            success: true,
            uptime: Date.now() - this.start,
          })
        );
      } else {
        res.end(
          JSON.stringify({
            success: false,
            error: "Invalid route",
          })
        );
      }
    });
  }
}

module.exports = WebServer;
