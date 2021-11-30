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
const JUMP_FORCE = 400;
const JUMP_FORCE_MAX = 550;
const DEATH_DEPTH = 500;
let currentJumpForce = JUMP_FORCE;

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
    $: () => [sprite("coin"), area(), "coin"],
    "%": () => [sprite("surprise"), area(), solid(), "coin-surprise"],
    "*": () => [sprite("surprise"), area(), solid(), "mushroom-surprise"],
    "}": () => [sprite("unboxed"), area(), solid()],
    "(": () => [
      sprite("pipe-bottom-left"),
      area(),
      solid(),
      scale(0.5),
      "pipe",
    ],
    ")": () => [
      sprite("pipe-bottom-right"),
      area(),
      solid(),
      scale(0.5),
      "pipe",
    ],
    "-": () => [sprite("pipe-top-left"), area(), solid(), scale(0.5), "pipe"],
    "+": () => [sprite("pipe-top-right"), area(), solid(), scale(0.5), "pipe"],
    "^": () => [
      sprite("evil-shroom"),
      area(),
      solid(),
      evilMushroomMovement(),
      "dangerous",
    ],
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
  function playerAction() {
    let timer = 0;
    let isBig = false;
    let isJumping = false;
    return {
      update() {
        if (this.isGrounded()) {
          this.isJumping = false;
        }
        // camera follow the player
        camPos(this.pos);
        // if player fall beneath death depth, game game-over
        if (this.pos.y > DEATH_DEPTH) {
          go("game-over", { score: score });
        }

        timer -= dt();
        if (timer <= 0) {
          this.smallify();
        }
      },
      smallify() {
        isBig = false;
        this.scale = vec2(1);
        timer = 0;
        currentJumpForce = JUMP_FORCE;
      },
      biggerify(time) {
        isBig = true;
        this.scale = vec2(2);
        timer = time;
        currentJumpForce = JUMP_FORCE_MAX;
      },
    };
  }
  function evilMushroomMovement() {
    let goLeft = true;
    return {
      update() {
        this.move(goLeft ? -SPEED / 2 : SPEED / 2, 0);
      },
    };
  }
  const gameLevel = addLevel(map, levelConfig);
  const player = add([
    sprite("mario"),
    area(),
    solid(),
    // apply gravity
    body(),
    pos(15, 30),
    origin("bot"),
    playerAction(),
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

  player.onHeadbutt((obj) => {
    if (obj.is("coin-surprise")) {
      add([sprite("coin"), pos(obj.pos.sub(0, 20)), area(), "coin"]);
      destroy(obj);
      add([sprite("unboxed"), pos(obj.pos.sub(0, 0)), area(), solid()]);
      return;
    }
    if (obj.is("mushroom-surprise")) {
      destroy(obj);
      add([sprite("unboxed"), pos(obj.pos.sub(0, 0)), area(), solid()]);
      const mushroom = add([
        sprite("mushroom"),
        pos(obj.pos.sub(0, 20)),
        area(),
        solid(),
        body(),
        "mushroom",
      ]);
      mushroom.onUpdate((obj) => {
        obj.move(SPEED * 0.5, 0);
      });
      return;
    }
  });

  player.onCollide("coin", (obj) => {
    destroy(obj);
    score += 1;
    scoreLabel.value = score;
    scoreLabel.text = score;
    return;
  });
  player.onCollide("mushroom", (obj) => {
    destroy(obj);
    player.biggerify(7);
    return;
  });
  player.onCollide("dangerous", (obj) => {
    if (player.isJumping) {
      destroy(obj);
      return;
    }
    player.solid = false;

    setTimeout(() => {
      go("game-over", { score: score });
    }, 1000);
    return;
  });

  onKeyDown("space", () => {
    if (player.grounded()) {
      player.isJumping = true;
      player.jump(currentJumpForce);
    }
  });
  onKeyDown("left", () => {
    player.move(-SPEED, 0);
  });
  onKeyDown("right", () => {
    player.move(SPEED, 0);
  });
});

scene("game-over", ({ score }) => {
  add([
    text(`You scored ${score} points`),
    origin("center"),
    pos(width() / 2, height() / 2),
    layer("ui"),
  ]);
});

go("game");
