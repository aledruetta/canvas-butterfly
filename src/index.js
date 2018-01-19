const env = {
  width: 800,
  height: 600,
  padding: 5,
  gridWidth: 100,
  gridHeight: 100,
  arrowWidth: 5,
};

const mov = {
  x0: 0,
  y0: env.height,
  x: ko.observable(0),
  y: null,
  yCart: ko.observable(0),
  vAngleD: ko.observable(55),
  vAngleR: null,
  v0: ko.observable(90),
  sides: 50,
  img: new Image(),
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
  ctx.lineWidth = 0.3;
  ctx.setLineDash([2, 4]);

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
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(xf, yf);
  ctx.stroke();

  // Arrow
  drawArrow(angle, xf, yf);

  ctx.restore();
}

function calcPos() {
  let t = 0;

  if (tStart != null) {
    t = ((Date.now() / timeFactor) - tStart);
  }

  const x = mov.x0 + (mov.v0() * Math.cos(mov.vAngleR) * t);
  const y = mov.y0 - (mov.v0() * Math.sin(mov.vAngleR) * t) + ((g * (t ** 2)) / 2);

  return { x, y };
}

function drawMov(xpar, ypar) {
  const x = xpar - (mov.sides / 2) + env.padding;
  const y = ypar - (mov.sides / 2) - env.padding;

  ctx.drawImage(mov.img, x, y);
}

function drawEnv() {
  ctx.clearRect(0, 0, env.width, env.height);

  drawAxes();
  drawGrid();

  if (mov.v0() > 0) {
    drawVector(0, 0, mov.v0(), mov.vAngleR);
  }
}

function loop() {
  const pos = calcPos();
  mov.x(pos.x);
  mov.y = pos.y;
  mov.yCart(env.height - pos.y);

  drawEnv();

  if (mov.y < env.height) {
    drawMov(mov.x(), mov.y);
    window.requestAnimationFrame(loop);
  } else {
    mov.y = env.height;
    mov.yCart(env.height - mov.y);
    drawMov(mov.x(), mov.y);
  }
}

function submit() {
  mov.vAngleR = deg2rad(mov.vAngleD());
  tStart = Date.now() / timeFactor;

  if (canvas.getContext) {
    window.requestAnimationFrame(loop);
  }
}

function init() {
  mov.vAngleR = deg2rad(mov.vAngleD());
  mov.img.src = './butterfly2.png';

  if (canvas.getContext) {
    drawEnv();
    drawMov(mov.x0, mov.y0);
  }
}

init();
