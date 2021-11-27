import kaboom from "https://unpkg.com/kaboom/dist/kaboom.mjs";
kaboom({
  global: true,
  fullscreen: true,
  scale: 1,
  debug: true,
  background: [0, 0, 0, 1],
});

loadRoot("./assets/sprites/");
loadSprite("coin", "wbKxhcd.png");
loadSprite("evil-shroom", "KPO3fR9.png");
loadSprite("brick", "pogC9x5.png");
loadSprite("block", "M6rwarW.png");
loadSprite("mario", "Wb1qfhK.png");
loadSprite("mushroom", "0wMd92p.png");
loadSprite("surprise", "gesQ1KP.png");
loadSprite("unboxed", "bdrLpi6.png");
loadSprite("pipe-top-left", "ReTPiWY.png");
loadSprite("pipe-top-right", "hj2GK4n.png");
loadSprite("pipe-bottom-left", "c1cYSbt.png");
loadSprite("pipe-bottom-right", "nqQ79eI.png");

loadSprite("blue-block", "fVscIbn.png");
loadSprite("blue-brick", "3e5YRQd.png");
loadSprite("blue-steel", "gqVoI2b.png");
loadSprite("blue-evil-shroom", "SvV4ueD.png");
loadSprite("blue-surprise", "RMqCc1G.png");

let score = 0;
let level = 1;
const SPEED = 120;
const JUMP = 360;

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");
  const map = [
    "                                      ",
    "                                      ",
    "                                      ",
    "                                      ",
    "                                      ",
    "     %   =*=%=                        ",
    "                                      ",
    "                            -+        ",
    "                    ^   ^   ()        ",
    "==============================   =====",
  ];
  const levelConfig = {
    width: 20,
    height: 20,
    "=": () => [sprite("block"), area(), solid()],
    $: () => [sprite("coin"), "coin"],
    "%": () => [sprite("surprise"), area(), solid(), "coin-surprise"],
    "*": () => [sprite("surprise"), area(), solid(), "mushroom-surprise"],
    "}": () => [sprite("unboxed"), area(), solid()],
    "(": () => [sprite("pipe-bottom-left"), area(), solid(), scale(0.5)],
    ")": () => [sprite("pipe-bottom-right"), area(), solid(), scale(0.5)],
    "-": () => [sprite("pipe-top-left"), area(), solid(), scale(0.5), "pipe"],
    "+": () => [sprite("pipe-top-right"), area(), solid(), scale(0.5), "pipe"],
    "^": () => [sprite("evil-shroom"), area(), solid(), "dangerous"],
    "#": () => [sprite("mushroom"), area(), solid(), "mushroom", body()],
    "!": () => [sprite("blue-block"), area(), solid(), scale(0.5)],
    "£": () => [sprite("blue-brick"), area(), solid(), scale(0.5)],
    z: () => [
      sprite("blue-evil-shroom"),
      area(),
      solid(),
      scale(0.5),
      "dangerous",
    ],
    "@": () => [
      sprite("blue-surprise"),
      area(),
      solid(),
      scale(0.5),
      "coin-surprise",
    ],
    x: () => [sprite("blue-steel"), area(), solid(), scale(0.5)],
  };
  const gameLevel = addLevel(map, levelConfig);
  const player = add([
    sprite("mario"),
    area(),
    solid(),
    // apply gravity
    body(),
    pos(15, 30),
    origin("bot"),
  ]);
  const scoreLabel = add([
    text(score),
    pos(15, 0),
    layer("ui"),
    scale(0.3),
    {
      value: score,
    },
  ]);
  const levelLabel = add([
    text(`level:${level}`),
    pos(10, 30),
    layer("ui"),
    scale(0.3),
    {
      value: level,
    },
  ]);

  onKeyDown("space", () => {
    if (player.grounded()) {
      player.jump(JUMP);
    }
  });
  onKeyDown("left", () => {
    player.move(-SPEED, 0);
  });
  onKeyDown("right", () => {
    player.move(SPEED, 0);
  });
});

go("game");
