const env = {
  width: 800,
  height: 600,
};

const mov = {
  x0: 5,
  y0: 595,
  thetaDeg: 35,
  thetaRad: null,
  v0: 85,
  radius: 5,
};

const g = 9.8;
const timeFactor = 275;
const tStart = Date.now() / timeFactor;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.globalCompositeOperation = 'destination-over';

function grad2rad(deg) {
  return (Math.PI / 180) * deg;
}

function drawGrid() {
  ctx.beginPath();

  ctx.moveTo(5, 0);
  ctx.lineTo(5, 595);
  ctx.stroke();

  ctx.lineTo(800, 595);
  ctx.stroke();
}

function drawmov() {
  ctx.fillStyle = 'red';

  const t = ((Date.now() / timeFactor) - tStart);
  const x = mov.x0 + (mov.v0 * Math.cos(mov.thetaRad) * t);
  const y = mov.y0 - (mov.v0 * Math.sin(mov.thetaRad) * t) + ((g * (t ** 2)) / 2);

  const startAngle = 0;
  const endAngle = 2 * Math.PI;

  ctx.beginPath();
  ctx.arc(x, y, mov.radius, startAngle, endAngle);
  ctx.fill();
}

function loop() {
  ctx.clearRect(0, 0, env.width, env.height);

  drawGrid();
  drawmov();

  window.requestAnimationFrame(loop);
}

function init() {
  mov.thetaRad = grad2rad(mov.thetaDeg);

  if (canvas.getContext) {
    window.requestAnimationFrame(loop);
  }
}

init();
