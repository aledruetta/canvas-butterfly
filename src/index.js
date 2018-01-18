const env = {
  width: 800,
  height: 600,
  padding: 5,
  gridWidth: 100,
  gridHeight: 100,
};

const mov = {
  x0: 5,
  y0: 595,
  thetaDeg: 65,
  thetaRad: null,
  v0: 95,
  radius: 8,
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

function drawAxes() {
  ctx.beginPath();

  ctx.moveTo(env.padding, 0);
  ctx.lineTo(env.padding, env.height - env.padding);
  ctx.stroke();

  ctx.lineTo(800, 595);
  ctx.stroke();

  ctx.moveTo(0, env.padding);
  ctx.lineTo(env.padding, 0);
  ctx.lineTo(10, env.padding);
  ctx.stroke();

  ctx.moveTo(795, 590);
  ctx.lineTo(800, 595);
  ctx.lineTo(795, 600);
  ctx.stroke();
}

function drawGrid() {
  ctx.beginPath();
  ctx.save();
  ctx.strokeStyle = 'gray';

  // Vertical
  for (let i = 0; i < (env.width / env.gridWidth); i++) {
    ctx.beginPath();
    ctx.moveTo((i * env.gridWidth) + env.padding, 0);
    ctx.lineTo((i * env.gridWidth) + env.padding, env.height - env.padding);
    ctx.stroke();
  }

  // Horizontal
  for (let i = 1; i < (env.height / env.gridHeight); i++) {
    ctx.beginPath();
    ctx.moveTo(env.padding, env.height - env.padding - (i * env.gridHeight));
    ctx.lineTo(env.width, env.height - env.padding - (i * env.gridHeight));
    ctx.stroke();
  }

  ctx.restore();
}

function calcTraj() {
  const t = ((Date.now() / timeFactor) - tStart);
  const x = mov.x0 + (mov.v0 * Math.cos(mov.thetaRad) * t);
  const y = mov.y0 - (mov.v0 * Math.sin(mov.thetaRad) * t) + ((g * (t ** 2)) / 2);

  return { x, y };
}

function drawMov(x, y) {
  ctx.fillStyle = 'red';

  const startAngle = 0;
  const endAngle = 2 * Math.PI;

  ctx.beginPath();
  ctx.arc(x, y, mov.radius, startAngle, endAngle);
  ctx.fill();
}

function loop() {
  const pos = calcTraj();
  ctx.clearRect(0, 0, env.width, env.height);

  drawAxes();
  drawGrid();
  drawMov(pos.x, pos.y);

  window.requestAnimationFrame(loop);
}

function init() {
  mov.thetaRad = grad2rad(mov.thetaDeg);

  if (canvas.getContext) {
    window.requestAnimationFrame(loop);
  }
}

init();
