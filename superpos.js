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
let ctx = canvas.getContext("2d");

let crispify = () => {
  // see: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas#scaling_for_high_resolution_displays
  const dpr = window.devicePixelRatio;

  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;

  ctx.scale(dpr, dpr);

  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
};

let particles = (new Array(Math.round(pdensity * window.innerWidth * window.innerHeight)))
  .fill(0)
  .map(() => [Math.random(), Math.random()]);

let draw = () => particles.forEach(c => {
  let x = Math.round(c[0] * window.innerWidth);
  let y = Math.round(c[1] * window.innerHeight);
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
  let lambda_abs = lambda * (window.innerWidth + window.innerHeight) / 2;
  let r = Math.hypot((p[0] - m[0]) * window.innerWidth, (p[1] - m[1]) * window.innerHeight);
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
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  waves.forEach(m => rock(m));
  vibrate();
  reset();
  draw();

  time += 1;
  window.requestAnimationFrame(loop);
};

crispify();
ctx.fillStyle = color;
window.requestAnimationFrame(loop);
