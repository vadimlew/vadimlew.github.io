export class AssetLoader {
  static async preload(bundle) {
    const entries = Object.entries(bundle);
    for (const [key, path] of entries) {
      PIXI.Loader.shared.add(key, path);
    }

    await new Promise((resolve) => {
      PIXI.Loader.shared.load(() => resolve());
    });
  }
}
