import { GameApp } from "./core/GameApp.js";
import { MainScene } from "./scenes/MainScene.js";

const app = new GameApp({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0x111111,
  parent: document.body
});

await app.init((ctx) => new MainScene(ctx));

window.addEventListener("resize", () => {
  app.pixi.renderer.resize(window.innerWidth, window.innerHeight);
});
