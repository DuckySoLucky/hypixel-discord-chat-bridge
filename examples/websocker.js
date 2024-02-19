// Import WebSocket module
const WebSocket = require("ws");

// Create a new WebSocket connection
const ws = new WebSocket("ws://localhost:1439/message");

// Event listener for when the connection is established
ws.on("open", () => {
  console.log("Connected");
});

// Event listener for when the connection is closed
ws.on("close", () => {
  console.log("Disconnected");
});

// Event listener for incoming messages
ws.on("message", (data) => {
  console.log(`Received: ${data}`);
});

new Promise((resolve) => {
  if (ws.readyState === ws.OPEN) {
    resolve();
  }
}).then(() => {
  // Define the message to be sent
  const send = {
    type: "message",
    data: "/gc Example message",
    token: "WEBSOCKET_TOKEN",
  };

  // Send the message
  ws.send(JSON.stringify(send));
});
