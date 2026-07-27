export class InputManager {
  constructor(view) {
    this.keys = {
      left: false,
      up: false,
      right: false,
      down: false
    };
    this.mouse = {
      x: 0,
      y: 0,
      left: false,
      right: false
    };

    this.#bind(view);
  }

  get anyKeyPressed() {
    return this.keys.left || this.keys.up || this.keys.right || this.keys.down;
  }

  #bind(view) {
    const mapDown = {
      KeyA: "left",
      ArrowLeft: "left",
      KeyW: "up",
      ArrowUp: "up",
      KeyD: "right",
      ArrowRight: "right",
      KeyS: "down",
      ArrowDown: "down"
    };

    window.addEventListener("keydown", (e) => {
      const key = mapDown[e.code];
      if (!key) return;
      e.preventDefault();
      this.keys[key] = true;
    });

    window.addEventListener("keyup", (e) => {
      const key = mapDown[e.code];
      if (!key) return;
      this.keys[key] = false;
    });

    view.addEventListener("mousedown", (e) => {
      if (e.button === 0) this.mouse.left = true;
      if (e.button === 2) this.mouse.right = true;
    });

    view.addEventListener("mouseup", (e) => {
      if (e.button === 0) this.mouse.left = false;
      if (e.button === 2) this.mouse.right = false;
    });

    view.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });

    view.addEventListener("mousemove", (e) => {
      const rect = view.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
  }
}
