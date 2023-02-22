class EndpointHandler {
  constructor(server) {
    this.server = server;
  }

  registerEvents() {
    const { web } = this.server;

    web.get("*", this.get.bind(this));
    web.post("*", this.post.bind(this));
  }

  async get(req, res) {
    res.send("API is running.");
  }

  async post(req, res) {
    res.json({ success: true });
  }
}

module.exports = EndpointHandler;
