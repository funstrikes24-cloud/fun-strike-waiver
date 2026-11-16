const fs = require('fs');
const { execFileSync } = require('child_process');
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

const genHtml = `<!DOCTYPE html>
<html>
<body>
  <canvas id="c" width="360" height="80"></canvas>
  <div id="output"></div>
  <script>
    const c = document.getElementById("c");
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 360, 80);
    ctx.strokeStyle = "#091026";
    ctx.lineWidth = 2.6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(35, 55);
    ctx.bezierCurveTo(65, 20, 85, 15, 105, 45);
    ctx.bezierCurveTo(115, 60, 125, 65, 145, 35);
    ctx.bezierCurveTo(155, 20, 175, 25, 195, 50);
    ctx.bezierCurveTo(215, 70, 235, 30, 265, 40);
    ctx.moveTo(30, 48);
    ctx.lineTo(125, 48);
    ctx.moveTo(75, 62);
    ctx.lineTo(275, 58);
    ctx.stroke();
    const data = c.toDataURL("image/png");
    document.getElementById("output").textContent = data;
  </script>
</body>
</html>`;

const genPath = 'E:/Aryan/fun-strikes-waiver/printables/gen-sig.html';
fs.writeFileSync(genPath, genHtml, 'utf8');

const output = execFileSync(CHROME_PATH, [
  '--headless=new',
  '--disable-gpu',
  '--dump-dom',
  genPath
]).toString();

const match = output.match(/<div id="output">(data:image\/png;base64,[^<]+)<\/div>/);
if (match) {
  fs.writeFileSync('E:/Aryan/fun-strikes-waiver/printables/sample-sig.txt', match[1], 'utf8');
  console.log('Valid Signature Data URL saved! Length:', match[1].length);
} else {
  console.error('Failed to capture signature');
}
fs.unlinkSync(genPath);
