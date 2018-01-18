const tela = {
  width: 800,
  height: 600,
};

const proj = {
  x0: 5,
  y0: 595,
  thetaDeg: 35,
  v0: 85,
  radius: 5,
};

const g = 9.8;
const timeFactor = 275;
const tStart = Date.now() / timeFactor;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
ctx.globalCompositeOperation = 'destination-over';

function rad(deg) {
  return (Math.PI / 180) * deg;
}

let theta = rad(proj.thetaDeg);

function draw() {
  ctx.clearRect(0, 0, tela.width, tela.height);
  ctx.fillStyle = 'red';

  let t = ((Date.now() / timeFactor) - tStart);
  let x = proj.x0 + proj.v0 * Math.cos(theta) * t;
  let y = proj.y0 - (proj.v0 * Math.sin(theta) * t) + ((g * (t ** 2)) / 2);

  const startAngle = 0;
  const endAngle = 2 * Math.PI;

  ctx.beginPath();
  ctx.arc(x, y, proj.radius, startAngle, endAngle);
  ctx.fill();

  if (y >= proj.y0 & x > 0) {
    return
  }

  window.requestAnimationFrame(draw);
}

function init() {
  if (canvas.getContext) {
    window.requestAnimationFrame(draw);
  }
}

init();
