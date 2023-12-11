export class Airplane {
    constructor() {

        // Transform
        this.x = 100;
        this.y = 100;
        this.angle = 0;
        this.size = 0.1;
        
        // Physics
        this.vx = 0.0;
        this.vy = 0.0;
        this.ax = 0.0;
        this.ay = 0.0;

        // Forces
        this.thrust = 0.0;
        this.drag = 0.0;
        this.lift = 0.0;
    }
}
