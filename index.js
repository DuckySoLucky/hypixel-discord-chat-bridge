process.on("uncaughtException", (error) => console.log(error));
const app = require("./src/Application.js");

("use strict");

app
  .register()
  .then(() => {
    app.connect();
  })
  .catch((error) => {
    console.error(error);
  });
