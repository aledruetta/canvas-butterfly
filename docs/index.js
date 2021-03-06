const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.globalCompositeOperation = 'destination-over';

const cartesian = {
  arrowWidth: 5,
  gridHeight: 50,
  gridWidth: 50,
  height: 600,
  width: 800,
  pad: 25,
};

const mov = {
  x0: 0,
  y0: 0,
  x: ko.observable(0),
  y: ko.observable(0),
  xMax: cartesian.pad,
  yMax: cartesian.height - cartesian.pad,
  vAngleD: ko.observable(62),
  vAngleR: null,
  v0Vector: ko.observable(13),
  v0: null,
  t: ko.observable(0),
  sides: 50,
  img: new Image(),
};

ko.applyBindings(mov);

const g = 9.8;
const millis = 1000;
const xScaleFactor = cartesian.gridWidth;
const yScaleFactor = cartesian.gridHeight;
let tStart = null;

// Convert degree angles to radians
function deg2rad(deg) {
  return (Math.PI / 180) * deg;
}

function drawAxes() {
  ctx.beginPath();

  // Y Axe
  ctx.moveTo(cartesian.pad, 0);
  ctx.lineTo(cartesian.pad, cartesian.height - cartesian.pad);
  ctx.stroke();

  // X Axe
  ctx.lineTo(cartesian.width, cartesian.height - cartesian.pad);
  ctx.stroke();

  // Y arrow
  drawArrow(Math.PI / 2, cartesian.pad, 0);

  // X arrow
  drawArrow(0, cartesian.width, cartesian.height - cartesian.pad);
}

function drawGrid() {
  ctx.save();
  ctx.strokeStyle = 'gray';
  ctx.lineWidth = 0.3;
  ctx.setLineDash([2, 4]);

  // Y lines
  for (let i = 0; i < (cartesian.width / cartesian.gridWidth); i++) {
    ctx.beginPath();
    ctx.moveTo((i * cartesian.gridWidth) + cartesian.pad, 0);
    ctx.lineTo((i * cartesian.gridWidth) + cartesian.pad, cartesian.height - cartesian.pad);
    ctx.stroke();
  }

  // X lines
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

function drawVector(x, y, long, angleD) {
  const angleR = deg2rad(angleD);
  const x0 = cartesian.pad + x;
  const y0 = cartesian.height - cartesian.pad - y;
  const xf = x0 + (long * Math.cos(angleR) * (xScaleFactor / 3));
  const yf = y0 - (long * Math.sin(angleR) * (yScaleFactor / 3));

  ctx.save();
  ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(xf, yf);
  ctx.stroke();

  drawArrow(angleR, xf, yf);

  ctx.restore();
}

function roundFloat(fNumber, precision) {
  const pow = 10 ** precision;
  let tmp = fNumber * pow;
  tmp = Math.floor(tmp);

  return tmp / pow;
}

let lastX = 0;
let hitFloor = false;

function calcPosition() {
  let t = 0;

  if (tStart != null && !hitFloor) {
    t = (Date.now() / millis) - tStart;
    mov.t(roundFloat(t, 2));
  }

  lastX = mov.x();
  const x = roundFloat(mov.x0 + (mov.v0 * Math.cos(mov.vAngleR) * t), 2);
  const y = roundFloat(mov.y0 + (mov.v0 * Math.sin(mov.vAngleR) * t)
            - ((g * (t ** 2)) / 2), 2);

  if (y < 0 || hitFloor) {
    hitFloor = true;
    mov.x(lastX);
    mov.y(0);
  } else {
    mov.x(x);
    mov.y(y);
  }
}

function drawMov() {
  calcPosition();
  const x = (mov.x() * xScaleFactor) + cartesian.pad;
  const y = cartesian.height - cartesian.pad - mov.sides - (mov.y() * yScaleFactor);
  ctx.drawImage(mov.img, x, y);
}

function drawComp() {
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 0, 255, 0.3)';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Y component
  const y = cartesian.height - cartesian.pad - (mov.y() * yScaleFactor);
  ctx.beginPath();
  ctx.moveTo(cartesian.pad, cartesian.height - cartesian.pad);
  ctx.lineTo(cartesian.pad, y);
  ctx.stroke();

  // X component
  ctx.beginPath();
  ctx.moveTo(cartesian.pad, cartesian.height - cartesian.pad);
  ctx.lineTo(cartesian.pad + (mov.x() * xScaleFactor), cartesian.height - cartesian.pad);
  ctx.stroke();

  ctx.restore();

  // Y max
  if (y > mov.yMax) {
    ctx.moveTo(cartesian.pad - cartesian.arrowWidth, mov.yMax);
    ctx.lineTo(cartesian.pad + cartesian.arrowWidth, mov.yMax);
    ctx.stroke();
  } else {
    mov.yMax = y;
  }
}

function drawEnv() {
  ctx.clearRect(0, 0, cartesian.width, cartesian.height);

  drawAxes();
  drawGrid();

  if (mov.v0Vector() > 0) {
    drawVector(0, 0, mov.v0Vector(), mov.vAngleD());
  }
}

function loop() {
  drawEnv();
  drawMov();
  drawComp();

  window.requestAnimationFrame(loop);
}

function submit() {
  tStart = Date.now() / millis;
  hitFloor = false;
  mov.xMax = cartesian.pad;
  mov.yMax = cartesian.height - cartesian.pad;
  mov.vAngleR = deg2rad(mov.vAngleD());
  mov.v0 = mov.v0Vector();

  if (canvas.getContext) {
    window.requestAnimationFrame(loop);
  }
}

function init() {
  mov.vAngleR = deg2rad(mov.vAngleD());
  mov.img.src = './butterfly2.png';

  if (canvas.getContext) {
    window.requestAnimationFrame(loop);
  }
}

init();
