// ビルドされたネイティブアドオンを読み込む
const grandiose = require("./build/Release/grandiose.node");

// アドオンの関数を使用する
console.log(grandiose.version());
console.log(grandiose.isSupportedCPU());

const finder = new grandiose.GrandioseFinder({
  showLocalSources: true,
});
console.log(finder);

setInterval(() => {
  const sources = finder.getCurrentSources();
  console.log(sources);

  if (sources.length > 0) {
    console.log("ソースが見つかりました。finderをdisposeします。");
    finder.dispose();
    clearInterval(intervalId);
  }
}, 500);

setTimeout(() => {
  finder.dispose();
}, 10000);
