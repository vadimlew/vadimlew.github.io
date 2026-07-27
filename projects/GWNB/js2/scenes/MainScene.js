import { Scene } from "../core/Scene.js";
import { AssetLoader } from "../core/AssetLoader.js";
import { LayerManager } from "../managers/LayerManager.js";
import { InputManager } from "../managers/InputManager.js";
import { Factory } from "../prefabs/Factory.js";
import { ASSETS } from "../prefabs/assets.js";

import { PhysicsSystem } from "../systems/PhysicsSystem.js";
import { BulletSystem } from "../systems/BulletSystem.js";
import { PlayerControlSystem } from "../systems/PlayerControlSystem.js";
import { EnemyAISystem } from "../systems/EnemyAISystem.js";
import { CollisionSystem } from "../systems/CollisionSystem.js";
import { WeaponSystem } from "../systems/WeaponSystem.js";
import { DamageSystem } from "../systems/DamageSystem.js";
import { LifetimeSystem } from "../systems/LifetimeSystem.js";
import { RenderSystem } from "../systems/RenderSystem.js";
import { CleanupSystem } from "../systems/CleanupSystem.js";

export class MainScene extends Scene {
  async init() {
    await AssetLoader.preload(ASSETS);

    this.layers = new LayerManager(this.stage);
    this.layers.create("floor");
    this.layers.create("game");
    this.layers.create("debug");

    this.input = new InputManager(this.app.pixi.view);
    this.factory = new Factory(this.world);

    this.world.events.on("spawn-bullet", (payload) => {
      this.factory.bullet(payload);
    });

    this.world.addSystem(new PlayerControlSystem(this.input, 10));
    this.world.addSystem(new EnemyAISystem(15));
    this.world.addSystem(new WeaponSystem(20));
    this.world.addSystem(new BulletSystem(21));
    this.world.addSystem(new PhysicsSystem(30));
    this.world.addSystem(new CollisionSystem(40));
    this.world.addSystem(new DamageSystem(50));
    this.world.addSystem(new LifetimeSystem(90));
    this.world.addSystem(new RenderSystem(this.layers, 100));
    this.world.addSystem(new CleanupSystem(999));

    this.#createLevel();
  }

  #createLevel() {
    this.factory.floor(0, 0, 205, 380, 0x33434f);
    this.factory.floor(205, 0, 195, 380, 0x2d3a44);
    this.factory.floor(0, 380, 600, 220, 0x2a3640);
    this.factory.floor(400, 0, 200, 380, 0x33434f);
    this.factory.floor(600, 0, 200, 600, 0x2a3640);

    this.factory.wall(5, 0, 800, 20);
    this.factory.wall(5, 355, 270, 20);
    this.factory.wall(330, 355, 270, 20);
    this.factory.wall(0, 575, 800, 20);

    this.factory.wall(0, 0, 20, 580);
    this.factory.wall(200, 5, 20, 100);
    this.factory.wall(200, 160, 20, 200);
    this.factory.wall(400, 5, 20, 100);
    this.factory.wall(400, 160, 20, 200);
    this.factory.wall(600, 0, 20, 450);
    this.factory.wall(600, 505, 20, 75);
    this.factory.wall(795, 0, 20, 580);

    this.factory.player(300, 150);

    this.#dinnerTable(445, 180);
    this.#dinnerTable(445, 240);
    this.#dinnerTable(530, 180);
    this.#dinnerTable(530, 240);

    this.factory.mimicChair(540, 380);
    this.factory.crab(300, 250);
    this.factory.crab(150, 550);
    this.factory.crab(450, 550);

    this.factory.plant(495, 405);
    this.factory.plant(300, 80);
  }

  #dinnerTable(x, y) {
    this.factory.table(x, y);
    this.factory.stool(x - 15, y + 15, 0x76c56f);
    this.factory.stool(x - 15, y - 5, 0x76c56f);
    this.factory.stool(x + 30, y + 15, 0xd8c165);
    this.factory.stool(x + 30, y - 5, 0xd8c165);
  }
}
