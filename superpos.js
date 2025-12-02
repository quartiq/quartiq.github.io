const color = "#581689"; // QUARTIQ purple

const pdensity = .02; // per px
const psize = 1; // px
const vstep = .0005; // of 1
const rstep = .0002; // of 1

const wavea = 1;
const lambda = .06; // of 1 * (w+h) / 2
const phi = 0; // of 2 * pi
const speed = .5; // of 1
const waves = [ [.4, 1], [.6, 1] ];

let time = 0;

// TODO: update canvas size on window resize
// update nparticles respectively
let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ctx = canvas.getContext("2d");
ctx.fillStyle = color;

let particles = (new Array(Math.round(pdensity * canvas.width * canvas.height)))
  .fill(0)
  .map(() => [Math.random(), Math.random()]);

let draw = () => particles.forEach(c => {
  let x = Math.round(c[0] * canvas.width);
  let y = Math.round(c[1] * canvas.height);
  ctx.fillRect(x, y, psize, psize);
});

let randDir = () => Math.random() * 2 - 1;

let vibrate = () => particles.forEach(p => {
  p[0] += randDir() * vstep;
  p[1] += randDir() * vstep;
});

let dir = (p, m) => {
  let dx = m[0] - p[0];
  let dy = m[1] - p[1];
  let len = Math.hypot(dx, dy);
  return [dx / len, dy / len];
};

let wave = (p, m) => {
  let lambda_abs = lambda * (canvas.width + canvas.height) / 2;
  let r = Math.hypot((p[0] - m[0]) * canvas.width, (p[1] - m[1]) * canvas.height);
  return wavea * Math.sin((2 * Math.PI * (r - speed * time) / lambda_abs) + phi);
};

let rock = m => particles.forEach(p => {
  let d = dir(p, m);
  let w = wave(p, m);
  p[0] += d[0] * w * rstep;
  p[1] += d[1] * w * rstep;
});

let reset = () => particles.forEach(p => {
  if (p[0] <= 0 || p[0] > 1) p[0] = Math.random();
  if (p[1] <= 0 || p[1] > 1) p[1] = Math.random();
});

let loop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  waves.forEach(m => rock(m));
  vibrate();
  reset();
  draw();

  time += 1;
  window.requestAnimationFrame(loop);
};

window.requestAnimationFrame(loop);
