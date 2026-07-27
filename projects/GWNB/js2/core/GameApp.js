import { World } from "./World.js";

export class GameApp {
  constructor({ width = 1280, height = 720, backgroundColor = 0x111111, parent = document.body } = {}) {
    this.pixi = new PIXI.Application({ width, height, antialias: true, backgroundColor });
    this.pixi.ticker.autoStart = false;
    this.world = new World();
    this.stage = this.pixi.stage;
    this.parent = parent;
    this.currentScene = null;
  }

  async init(sceneFactory) {
    this.parent.appendChild(this.pixi.view);
    this.pixi.view.focus();
    this.currentScene = sceneFactory(this);
    await this.currentScene.init();

    this.pixi.ticker.add((ticker) => {
      const dt = ticker.deltaMS / 16.6667;
      this.world.update(dt);
      if (this.currentScene) {
        this.currentScene.update(dt);
      }
    });

    this.pixi.ticker.start();
  }

  async setScene(sceneFactory) {
    if (this.currentScene) {
      this.currentScene.destroy();
      this.world.destroy();
      this.world = new World();
    }

    this.currentScene = sceneFactory(this);
    await this.currentScene.init();
  }
}
