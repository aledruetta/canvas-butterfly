const env = {
  width: 800,
  height: 600,
  padding: 5,
  gridWidth: 100,
  gridHeight: 100,
  arrowWidth: 5,
};

const mov = {
  x0: 5,
  y0: 595,
  x: ko.observable(),
  y: null,
  yCart: ko.observable(),
  thetaDeg: ko.observable(45),
  thetaRad: null,
  v0: ko.observable(80),
  radius: 8,
};

ko.applyBindings(mov);

const g = 9.8;
const timeFactor = 275;
let tStart = null;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.globalCompositeOperation = 'destination-over';

function deg2rad(deg) {
  return (Math.PI / 180) * deg;
}

function drawAxes() {
  ctx.beginPath();

  // Vertical
  ctx.moveTo(env.padding, 0);
  ctx.lineTo(env.padding, env.height - env.padding);
  ctx.stroke();

  // Horizontal
  ctx.lineTo(800, 595);
  ctx.stroke();

  // Vertical arrow
  drawArrow(Math.PI / 2, env.padding, 0);

  // Horizontal arrow
  drawArrow(0, env.width, env.height - env.padding);
}

function drawGrid() {
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

function drawArrow(angle, xf, yf) {
  const arrowAngle1 = angle + (0.75 * Math.PI);
  const hypo = 2 * (env.arrowWidth ** 2);
  const arrowX1 = xf + (Math.sqrt(hypo) * Math.cos(arrowAngle1));
  const arrowY1 = yf - (Math.sqrt(hypo) * Math.sin(arrowAngle1));
  const arrowAngle2 = angle - (0.75 * Math.PI);
  const arrowX2 = xf + (Math.sqrt(hypo) * Math.cos(arrowAngle2));
  const arrowY2 = yf - (Math.sqrt(hypo) * Math.sin(arrowAngle2));

  ctx.beginPath();
  ctx.moveTo(arrowX1, arrowY1);
  ctx.lineTo(xf, yf);
  ctx.lineTo(arrowX2, arrowY2);
  ctx.stroke();
}

function drawVector(x, y, long, angle) {
  const x0 = env.padding + x;
  const y0 = env.height - env.padding - y;
  const xf = x0 + (long * Math.cos(angle));
  const yf = y0 - (long * Math.sin(angle));

  ctx.save();
  ctx.strokeStyle = 'blue';

  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(xf, yf);
  ctx.stroke();

  // Arrow
  drawArrow(angle, xf, yf);

  ctx.restore();
}

function calcTraj() {
  const t = ((Date.now() / timeFactor) - tStart);
  const x = mov.x0 + (mov.v0() * Math.cos(mov.thetaRad) * t);
  const y = mov.y0 - (mov.v0() * Math.sin(mov.thetaRad) * t) + ((g * (t ** 2)) / 2);

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

function drawEnv() {
  ctx.clearRect(0, 0, env.width, env.height);

  drawAxes();
  drawGrid();

  if (mov.v0() > 0) {
    drawVector(0, 0, mov.v0(), mov.thetaRad);
  }
}

function loop() {
  const pos = calcTraj();
  mov.x(pos.x);
  mov.y = pos.y;
  mov.yCart(env.height - env.padding - pos.y);

  drawEnv();

  if (mov.y >= env.height - env.padding) {
    drawMov(mov.x(), env.height - env.padding);
    return;
  }

  drawMov(mov.x(), mov.y);

  window.requestAnimationFrame(loop);
}

function submit() {
  mov.thetaRad = deg2rad(mov.thetaDeg());
  tStart = Date.now() / timeFactor;

  if (canvas.getContext) {
    window.requestAnimationFrame(loop);
  }
}

function init() {
  mov.thetaRad = deg2rad(mov.thetaDeg());

  drawEnv();
  drawMov(mov.x0, mov.y0);
}

init();
