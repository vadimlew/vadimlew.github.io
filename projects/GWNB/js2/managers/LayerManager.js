export class LayerManager {
  constructor(stage) {
    this.stage = stage;
    this.layers = new Map();
  }

  create(name) {
    if (!this.layers.has(name)) {
      const container = new PIXI.Container();
      container.name = name;
      this.layers.set(name, container);
      this.stage.addChild(container);
    }
    return this.layers.get(name);
  }

  get(name) {
    return this.layers.get(name) || null;
  }
}
