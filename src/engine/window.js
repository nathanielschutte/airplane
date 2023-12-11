import { Scene } from './scene.js';

export class Window {
    constructor(element = null, width = 1000, height = 800) {
        this.width = width;
        this.height = height;
        this.parentElement = element;
        this.canvas = null;
        this.frameNum = 0;
        this.time = 0;
        this.scene = null;

        this.mouse = {
            x: 0,
            y: 0,
            down: false
        };

        this.keys = {};
        this.running = false;
        this.debugInfo = {};
        this.debugInfoElement = document.getElementById('debug-info');
        this.setupCanvas();

        return this;
    }

    setBackgroundColor(r, g, b) {
        this.canvas.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    }

    async load(scene) {
        if (!scene || !(scene instanceof Scene)) {
            throw new Error('No Scene provided');
        }
        
        if (this.scene) {
            this.scene.unload();
        }

        this.scene = scene;
        this.scene.setWindow(this);
        await this.scene.load();
    }

    start() {
        this.scene.init();
        this.running = true;
        this.time = 0;
        requestAnimationFrame(() => this.loop());
    }

    stop() {
        this.running = false;
    }

    loop() {

        // Update
        const deltaTime = this.frameNum === 0 ? 0 : (Date.now() - this.time) / 1000;
        this.scene.update({ mouse: this.mouse, keys: this.keys, frameNum: this.frameNum, delta: deltaTime });
        //console.log(`[Window] Frame ${this.frameNum} (${deltaTime} s)`);
        this.time = Date.now();
        
        
        // Draw
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.canvas.style.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.scene.draw(this.ctx);
    

        // Debug
        this.renderDebug();


        // Loop
        this.frameNum++;
        if (this.running) {
            requestAnimationFrame(() => this.loop());
        }
    }

    keyPress(key) {
        if (this.keys[key] && this.keys[key].press === this.frameNum) {
            return true;
        }
        return false;
    }

    setDebugField(field, value) {
        this.debugInfo[field] = value;
    }
    
    renderDebug() {
        if (!this.debugInfoElement) {
            return;
        }
        this.debugInfoElement.innerHTML = '';
        for (const [key, value] of Object.entries(this.debugInfo)) {
            const p = document.createElement('span');
            p.innerHTML = `${key}: ${value}`;
            this.debugInfoElement.appendChild(p);
        }
    }

    setupCanvas() {
        if (!this.parentElement) {
            this.parentElement = document.body;
        }
        const canvas = document.createElement('canvas');
        this.parentElement.appendChild(canvas);
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        const ctx = canvas.getContext('2d');

        window.addEventListener('resize', () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }, false);

        window.addEventListener('keydown', e => {
            const key = e.key;
            if (key === ' ' || key === 'Tab' || key === 'Escape') {
                e.preventDefault();
            }
            if (!this.keys[key]) {
                this.keys[key] = {};
            }
            if (!this.keys[key].down) {
                this.keys[key].down = true;
                this.keys[key].press = this.frameNum;
                // console.log(`[Key] ${key} down`);
            } else {
                this.keys[key].press = false;
            }
            this.keys[key].release = false;
        });

        window.addEventListener('keyup', e => {
            const key = e.key;
            if (!this.keys[key]) {
                this.keys[key] = {};
            }
            if (this.keys[key].down) {
                this.keys[key].down = false;
                this.keys[key].release = this.frameNum;
            } else {
                this.keys[key].release = false;
            }
            this.keys[key].press = false;
        });
        
        canvas.addEventListener('mousemove', e => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        canvas.addEventListener('mousedown', e => {
            this.mouse.down = true;
        });
        
        canvas.addEventListener('mouseup', e => {
            this.mouse.down = false;
        });
        
        canvas.addEventListener('mouseleave', e => {
            this.mouse.down = false;
        });

        // why not working
        window.dispatchEvent(new Event('resize'));

        this.canvas = canvas;
        this.ctx = ctx;
    }
}
