import { System } from "../core/System.js";
import { C } from "../utils/ComponentTypes.js";

export class RenderSystem extends System {
  constructor(layerManager, priority = 100) {
    super(priority);
    this.layerManager = layerManager;
  }

  update() {
    const entities = this.world.query([C.TRANSFORM, C.DISPLAY]);

    for (const entity of entities) {
      const tr = entity.get(C.TRANSFORM);
      const display = entity.get(C.DISPLAY);
      const sprite = display.sprite;

      if (!sprite.parent) {
        const layer = this.layerManager.get(display.layer);
        if (layer) layer.addChild(sprite);
      }

      sprite.x = tr.x;
      sprite.y = tr.y - tr.z;
      sprite.sortY = tr.y + tr.z + display.sortOffsetY + display.sortHeight;

      if (display.shadow) {
        display.shadow.x = tr.x;
        display.shadow.y = tr.y;
      }
    }

    const gameLayer = this.layerManager.get("game");
    if (gameLayer) {
      gameLayer.children.sort((a, b) => (a.sortY || 0) - (b.sortY || 0));
    }
  }
}
