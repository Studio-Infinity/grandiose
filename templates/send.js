const grandiose = require("../build/Release/grandiose.node");
const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");

// 画像データを読み込む
fs.readFile("image.png", (err, data) => {
  if (err) {
    console.error("Error reading image file:", err);
    return;
  }

  // 画像データをCanvasにロードする
  loadImage(data)
    .then((image) => {
      const width = image.width;
      const height = image.height;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, width, height);

      // 画像データをNDI形式に変換する
      const imageData = ctx.getImageData(0, 0, width, height);
      const videoFrame = {
        xres: width,
        yres: height,
        fourCC: 0x41424752, // RGBA FourCC
        frameRateN: 30000, // Numerator for 30 fps
        frameRateD: 1000, // Denominator for 30 fps
        pictureAspectRatio: width / height,
        data: imageData.data,
        frameFormatType: 1,
        lineStrideBytes: width * 4,
      };

      console.log("Video frame prepared:", videoFrame);

      // grandiose.sendを使用して送信する
      grandiose
        .send({
          name: "example_name",
          clockVideo: true,
          clockAudio: false,
        })
        .then((sender) => {
          console.log("Sender created:", sender);

          // 30fpsでビデオフレームを送信するためのインターバルを設定
          const intervalId = setInterval(() => {
            if (typeof sender.video === "function") {
              sender.video(videoFrame);
            } else {
              console.error("video is not a function on sender:", sender);
              clearInterval(intervalId);
            }
          }, 1000 / 30); // 30 FPS
        })
        .catch((error) => {
          console.error("Error sending image:", error);
        });
    })
    .catch((error) => {
      console.error("Error loading image:", error);
    });
});
