const EndpointHandler = require("./handlers/EndpointHandler.js");
const { webMessage } = require("../Logger.js");
const config = require("../../config.json");
const express = require("express");

class WebServer {
  constructor(app) {
    this.app = app;

    this.port = config.web.port;

    this.endpointHandler = new EndpointHandler(this);
  }

  connect() {
    if (config.web.enabled === false) return;

    this.web = express();
    this.web.use(express.json());

    this.endpointHandler.registerEvents();

    this.web.listen(this.port, () => {
      webMessage(`Server running at http://localhost:${this.port}/`);
    });
  }
}

module.exports = WebServer;
