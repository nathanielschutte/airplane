import { Scene } from '../engine/scene.js';
import { Airplane } from './airplane.js';

export class AirplaneScene extends Scene {
    constructor() {
        super();
    }

    async load() {
        this.airplaneResource = await this.useImage('airplane', './airplane/res/airplane.png');
    }

    init() {
        this.airplane = new Airplane();
    }

    update({ mouse, keys, frameNum, delta }) {

    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.airplane.x, this.airplane.y);
        ctx.scale(this.airplane.size, this.airplane.size);
        ctx.rotate(this.airplane.angle);
        ctx.drawImage(this.airplaneResource, -this.airplaneResource.width / 2, -this.airplaneResource.height / 2);
        ctx.restore();
    }
}
