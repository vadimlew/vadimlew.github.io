export class Scene {
  constructor(app) {
    this.app = app;
    this.world = app.world;
    this.stage = app.stage;
  }

  async init() {}

  update(_dt) {}

  destroy() {}
}
