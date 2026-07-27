import { EventBus } from "./EventBus.js";

export class World {
  constructor() {
    this.entities = [];
    this.systems = [];
    this.events = new EventBus();
  }

  addEntity(entity) {
    this.entities.push(entity);
    return entity;
  }

  removeEntity(entity) {
    entity.kill();
  }

  addSystem(system) {
    system.world = this;
    this.systems.push(system);
    this.systems.sort((a, b) => a.priority - b.priority);
    system.init();
    return system;
  }

  query(componentTypes = [], tag = null) {
    return this.entities.filter((entity) => {
      if (!entity.alive) return false;
      if (tag && !entity.hasTag(tag)) return false;
      for (const type of componentTypes) {
        if (!entity.has(type)) return false;
      }
      return true;
    });
  }

  findByName(name) {
    return this.entities.find((entity) => entity.alive && entity.name === name) || null;
  }

  update(dt) {
    for (const system of this.systems) {
      system.update(dt);
    }
    this.entities = this.entities.filter((entity) => entity.alive);
  }

  destroy() {
    for (const system of this.systems) {
      system.destroy();
    }
    this.systems = [];
    this.entities = [];
    this.events.clear();
  }
}
