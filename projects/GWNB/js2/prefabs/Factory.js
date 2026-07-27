import { Entity } from "../core/Entity.js";
import { Transform } from "../components/Transform.js";
import { Display } from "../components/Display.js";
import { Body } from "../components/Body.js";
import { Collider } from "../components/Collider.js";
import { Health } from "../components/Health.js";
import { Weapon } from "../components/Weapon.js";
import { PlayerController } from "../components/PlayerController.js";
import { EnemyAI } from "../components/EnemyAI.js";
import { Bullet } from "../components/Bullet.js";
import { Lifetime } from "../components/Lifetime.js";

function makeRectSprite(width, height, color) {
  const g = new PIXI.Graphics();
  g.beginFill(color);
  g.drawRect(-width / 2, -height / 2, width, height);
  g.endFill();
  return g;
}

function makeFloorTile(width, height, color) {
  const g = new PIXI.Graphics();
  g.beginFill(color);
  g.drawRect(0, 0, width, height);
  g.endFill();
  return g;
}

function spriteFrom(key, fallback) {
  const texture = PIXI.utils.TextureCache[key];
  if (texture) {
    return PIXI.Sprite.from(texture);
  }
  return fallback();
}

export class Factory {
  constructor(world) {
    this.world = world;
  }

  floor(x, y, w, h, color = 0x2f3d46) {
    const entity = new Entity("floor");
    const sprite = makeFloorTile(w, h, color);
    sprite.x = x;
    sprite.y = y;

    entity
      .add(new Transform(x, y, 0))
      .add(new Display({ sprite, layer: "floor" }));

    return this.world.addEntity(entity);
  }

  wall(x, y, w, h) {
    const entity = new Entity("wall");
    const sprite = makeFloorTile(w, h, 0x0f3044);
    sprite.x = x;
    sprite.y = y;

    entity
      .add(new Transform(x, y, 0))
      .add(new Display({ sprite, layer: "game", sortOffsetY: h, sortHeight: 8 }))
      .add(new Body({ staticBody: true, mass: 9999 }))
      .add(new Collider({ x: 0, y: 0, width: w, height: h, type: "wall", masks: ["player", "enemy", "bullet"] }));

    return this.world.addEntity(entity);
  }

  player(x, y) {
    const entity = new Entity("player");
    const sprite = spriteFrom("player_walk_front_0", () => makeRectSprite(20, 32, 0x4bd4ff));
    if (sprite.anchor) sprite.anchor.set(0.5, 0.8);

    entity
      .add(new Transform(x, y, 0))
      .add(new Display({ sprite, layer: "game", sortOffsetY: 0, sortHeight: 20 }))
      .add(new Body({ mass: 70, friction: 0.84, gravity: 0.4 }))
      .add(new Collider({ x: -10, y: -8, width: 20, height: 14, type: "player", masks: ["wall", "enemy"] }))
      .add(new Health(200))
      .add(new PlayerController({ speed: 0.35, jumpSpeed: 1.55 }))
      .add(new Weapon({ bulletType: "player_bullet", masks: ["enemy", "wall"], cooldown: 10, speed: 8, damage: 45 }));

    return this.world.addEntity(entity);
  }

  crab(x, y) {
    const entity = new Entity("enemy_crab");
    const sprite = spriteFrom("enemy_crab_walk_0", () => makeRectSprite(18, 18, 0xff7c6b));
    if (sprite.anchor) sprite.anchor.set(0.5, 0.85);

    entity
      .add(new Transform(x, y, 0))
      .add(new Display({ sprite, layer: "game", sortOffsetY: 0, sortHeight: 18 }))
      .add(new Body({ mass: 35, friction: 0.9 }))
      .add(new Collider({ x: -8, y: -8, width: 16, height: 16, type: "enemy", masks: ["wall", "player"] }))
      .add(new Health(100))
      .add(new EnemyAI({ kind: "crab", seekRadius: 180, speed: 0.26 }));

    return this.world.addEntity(entity);
  }

  mimicChair(x, y) {
    const entity = new Entity("enemy_mimic_chair");
    const sprite = spriteFrom("chair_red_front.png", () => makeRectSprite(30, 30, 0xc75454));
    if (sprite.anchor) sprite.anchor.set(0.5, 0.8);

    entity
      .add(new Transform(x, y, 0))
      .add(new Display({ sprite, layer: "game", sortOffsetY: 0, sortHeight: 24 }))
      .add(new Body({ mass: 45, friction: 0.92 }))
      .add(new Collider({ x: -10, y: -10, width: 20, height: 20, type: "enemy", masks: ["wall", "player"] }))
      .add(new Health(220))
      .add(new EnemyAI({ kind: "mimic", seekRadius: 260, speed: 0.12, shootCooldown: 35 }))
      .add(new Weapon({ bulletType: "enemy_bullet", masks: ["player", "wall"], cooldown: 15, speed: 6, damage: 25 }));

    return this.world.addEntity(entity);
  }

  stool(x, y, color = 0x76c56f) {
    const entity = new Entity("stool");
    const sprite = makeRectSprite(16, 16, color);

    entity
      .add(new Transform(x, y, 0))
      .add(new Display({ sprite, layer: "game", sortOffsetY: 0, sortHeight: 12 }))
      .add(new Body({ mass: 12, friction: 0.9 }))
      .add(new Collider({ x: -8, y: -8, width: 16, height: 16, type: "interior", masks: ["wall", "player", "enemy"] }));

    return this.world.addEntity(entity);
  }

  table(x, y) {
    const entity = new Entity("table");
    const sprite = spriteFrom("dining_white_vertical_table.png", () => makeRectSprite(32, 44, 0xe3e2dc));
    if (sprite.anchor) sprite.anchor.set(0.5, 0.8);

    entity
      .add(new Transform(x, y, 0))
      .add(new Display({ sprite, layer: "game", sortOffsetY: 10, sortHeight: 18 }))
      .add(new Body({ mass: 60, friction: 0.86 }))
      .add(new Collider({ x: -14, y: -10, width: 28, height: 20, type: "interior", masks: ["wall", "player", "enemy"] }));

    return this.world.addEntity(entity);
  }

  plant(x, y) {
    const entity = new Entity("plant");
    const sprite = spriteFrom("flower.png", () => makeRectSprite(10, 18, 0x8dd06b));
    if (sprite.anchor) sprite.anchor.set(0.5, 0.9);

    entity
      .add(new Transform(x, y, 0))
      .add(new Display({ sprite, layer: "game", sortOffsetY: 0, sortHeight: 12 }))
      .add(new Body({ mass: 6, friction: 0.88 }))
      .add(new Collider({ x: -6, y: -6, width: 12, height: 10, type: "interior", masks: ["wall", "player", "enemy"] }))
      .add(new Health(40));

    return this.world.addEntity(entity);
  }

  bullet({ x, y, vx, vy, damage, type, masks, ownerTag }) {
    const entity = new Entity(type);
    const sprite = makeRectSprite(6, 4, ownerTag === "player" ? 0xffcf4b : 0xff6d6d);

    entity
      .add(new Transform(x, y, 0))
      .add(new Display({ sprite, layer: "game", sortOffsetY: 0, sortHeight: 2 }))
      .add(new Collider({ x: -3, y: -2, width: 6, height: 4, type, masks }))
      .add(new Bullet({ vx, vy, damage, ownerTag }))
      .add(new Lifetime(80));

    return this.world.addEntity(entity);
  }
}
