let entityCounter = 0;

export class Entity {
  constructor(name = "entity") {
    this.id = ++entityCounter;
    this.name = name;
    this.components = new Map();
    this.tags = new Set();
    this.alive = true;
  }

  add(component) {
    this.components.set(component.type, component);
    return this;
  }

  remove(type) {
    this.components.delete(type);
    return this;
  }

  has(type) {
    return this.components.has(type);
  }

  get(type) {
    return this.components.get(type);
  }

  addTag(tag) {
    this.tags.add(tag);
    return this;
  }

  hasTag(tag) {
    return this.tags.has(tag);
  }

  kill() {
    this.alive = false;
  }
}
