// server.js
require("dotenv").config();
const http       = require("http");
const { Server } = require("socket.io");
const chatSocket = require("./src/Socket/chatsocket");
const app = require("./src/app")
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.WIDGET_ORIGIN,   // Person B's widget URL
    methods: ["GET", "POST"],
  },
});

// Hand off all socket logic to chatSocket module
chatSocket(io);

httpServer.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});