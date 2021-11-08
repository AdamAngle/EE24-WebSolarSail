import {SceneManager} from './sceneManager.js';

const canvas = document.getElementById('ss-canvas');
const loader = document.getElementById('overlay');
const spanner = document.getElementById('spanner');
setLoaderShown(true);
const sceneManager = new SceneManager(canvas, ()=>{setLoaderShown(false);});

$(function() {
	bindEventListeners();
	render();
});


function setLoaderShown(isShown) {
	loader.classList.toggle('show', isShown);
	spanner.classList.toggle('show', isShown);
}

function render() {
  requestAnimationFrame(render);
  sceneManager.update();
}

function bindEventListeners() {
	window.onresize = resizeCanvas;
	resizeCanvas();	
}

function resizeCanvas() {
	canvas.style.width = '100%';
	canvas.style.height= '100%';
	
	canvas.width  = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
    
  sceneManager.onWindowResize();
}