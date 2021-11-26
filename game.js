import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";
kaboom({
  global: true,
  fullscreen: true,
  scale: 1,
  debug: true,
  background: [0, 0, 0, 1],
});

scene("game", () => {});
