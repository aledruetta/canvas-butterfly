const tela = {
  width: 600,
  height: 300,
};

const proj = {
  x0: 0,
  y0: 300,
  thetaDeg: 30,
  v0: 80,
  radius: 3,
};

const g = 9.8;
const tStart = Date.now() / 1000;

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

  let t = ((Date.now() / 1000) - tStart);
  let x = proj.x0 + proj.v0 * Math.cos(theta) * t;
  let y = proj.y0 - (proj.v0 * Math.sin(theta) * t) + ((g * (t ** 2)) / 2);

  const startAngle = 0;
  const endAngle = 2 * Math.PI;

  ctx.beginPath();
  ctx.arc(x, y, proj.radius, startAngle, endAngle, true);
  ctx.fill();

  if (y > tela.height & x > 0) {
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
