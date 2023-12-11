export class Scene {
    constructor(window = null) {
        this.window = window;
        this.assets = {};
    }

    setWindow(window) {
        this.window = window;
    }

    async useImage(id, path, reload = false) {
        if (!reload && this.assets[id]) {
            return this.assets[id];
        }

        this.assets[id] = await Scene._loadImage(path);
        return this.assets[id];
    }

    static _loadImage(path) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = path;
        });
    }

    async load() {}

    unload() {
        delete this.assets;
        this.assets = {};
    }

    init() {}

    update(state) {}

    draw(ctx) {}
}
