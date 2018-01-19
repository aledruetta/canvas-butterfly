const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.globalCompositeOperation = 'destination-over';

const cartesian = {
  arrowWidth: 5,
  gridHeight: 50,
  gridWidth: 50,
  height: 600,
  pad: 25,
  width: 800,
};

const mov = {
  x0: 0,
  y0: cartesian.height,
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
const timeFactor = 225;
let tStart = null;

// Convert degree angles to radians
function deg2rad(deg) {
  return (Math.PI / 180) * deg;
}

function drawAxes() {
  ctx.beginPath();

  // Vertical
  ctx.moveTo(cartesian.pad, 0);
  ctx.lineTo(cartesian.pad, cartesian.height - cartesian.pad);
  ctx.stroke();

  // Horizontal
  ctx.lineTo(cartesian.width, cartesian.height - cartesian.pad);
  ctx.stroke();

  // Vertical arrow
  drawArrow(Math.PI / 2, cartesian.pad, 0);

  // Horizontal arrow
  drawArrow(0, cartesian.width, cartesian.height - cartesian.pad);
}

function drawGrid() {
  ctx.save();
  ctx.strokeStyle = 'gray';
  ctx.lineWidth = 0.3;
  ctx.setLineDash([2, 4]);

  // Vertical
  for (let i = 0; i < (cartesian.width / cartesian.gridWidth); i++) {
    ctx.beginPath();
    ctx.moveTo((i * cartesian.gridWidth) + cartesian.pad, 0);
    ctx.lineTo((i * cartesian.gridWidth) + cartesian.pad, cartesian.height - cartesian.pad);
    ctx.stroke();
  }

  // Horizontal
  for (let i = 1; i < (cartesian.height / cartesian.gridHeight); i++) {
    ctx.beginPath();
    ctx.moveTo(cartesian.pad, cartesian.height - cartesian.pad - (i * cartesian.gridHeight));
    ctx.lineTo(cartesian.width, cartesian.height - cartesian.pad - (i * cartesian.gridHeight));
    ctx.stroke();
  }

  ctx.restore();
}

function drawArrow(angle, xf, yf) {
  const arrowAngle1 = angle + (0.75 * Math.PI);
  const hypo = 2 * (cartesian.arrowWidth ** 2);
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
  const x0 = cartesian.pad + x;
  const y0 = cartesian.height - cartesian.pad - y;
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

function roundFloat(fNumber, precision) {
  const pow = 10 ** precision;
  let tmp = fNumber * pow;
  tmp = Math.floor(tmp);
  return tmp / pow;
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
  const x = xpar + cartesian.pad;
  const y = ypar - (mov.sides ) - cartesian.pad;

  ctx.drawImage(mov.img, x, y);
}

function drawEnv() {
  ctx.clearRect(0, 0, cartesian.width, cartesian.height);

  drawAxes();
  drawGrid();

  if (mov.v0() > 0) {
    drawVector(0, 0, mov.v0(), mov.vAngleR);
  }
}

function loop() {
  const pos = calcPos();
  mov.x(roundFloat(pos.x, 2));
  mov.y = pos.y;
  mov.yCart(roundFloat(cartesian.height - pos.y, 2));

  drawEnv();

  if (mov.y < cartesian.height) {
    drawMov(mov.x(), mov.y);
    window.requestAnimationFrame(loop);
  } else {
    mov.y = cartesian.height;
    mov.yCart(cartesian.height - mov.y);
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
