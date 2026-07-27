export class System {
  constructor(priority = 0) {
    this.priority = priority;
    this.world = null;
  }

  init() {}

  update(_dt) {}

  destroy() {}
}
