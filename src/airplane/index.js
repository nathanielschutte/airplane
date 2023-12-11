console.log('script loaded');

import { Window } from '../engine/window.js';
import { AirplaneScene } from './scene.js';

const window = new Window(document.getElementById('window'));
window.setBackgroundColor(100, 240, 255);
const scene = new AirplaneScene();
await window.load(scene);
window.start();
