const grandiose = require("./build/Release/grandiose.node");
const express = require("express");
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static("public"));

wss.on("connection", (ws) => {
  console.log("Client connected");

  grandiose
    .receive({
      source: {
        name: 'HD CAMERA (,192.168.100.23)',
        urlAddress: '192.168.100.23:5961',
        ipAddress: '192.168.100.23:5961'
      },
      colorFormat: 2,
    })
    .then((source) => {
      console.log("Source received:", source);

      // フレームを定期的に取得する
      const intervalId = setInterval(() => {
        source
          .video()
          .then((frame) => {
            console.log("Frame received:", frame);
            ws.send(frame.data);
          })
          .catch((error) => {
            console.error("Error receiving frame:", error);
          });
      }, 1000 / 30); // 30 FPS

      ws.on("close", () => {
        console.log("Client disconnected");
        clearInterval(intervalId);
      });
    })
    .catch((error) => {
      console.error("Error receiving source:", error);
    });
});

server.listen(8000, () => {
  console.log("Server is listening on http://localhost:8000");
});
