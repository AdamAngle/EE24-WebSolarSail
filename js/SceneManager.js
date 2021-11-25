//import * as THREE from './libs/three.js'
import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import {GeneralLights} from "./sceneSubjects/GeneralLights.js";
import {SceneSubject, GridSubject} from "./sceneSubjects/SceneSubject.js";
import {SkyboxSubject} from "./sceneSubjects/SkyboxSubject.js";
import {SunBody, PlanetBody} from "./sceneSubjects/SystemBodies.js";

const addDays = function(d, days) {
  var date = new Date(d.valueOf());
  date.setHours(date.getHours() + days);
  return date;
}

// Fancy function-based class for managing scenes.
export function SceneManager(canvas, onLoadComplete=null)
{
  const clock = new THREE.Clock();

  const screenDimensions = {
    width: canvas.width,
    height: canvas.height
  }

  const scene = buildScene();
  const renderer = buildRender(screenDimensions);
  const camera = buildCamera(screenDimensions);
  var controls;
  this.currentTime = new Date();
  buildControls(camera, renderer);
  const sceneSubjects = createSceneSubjects(scene);
  var systemSubjects = [];

  $.ajax({
    url: "/solarsystem.json",
    dataType: "json",
    success: function(data) {
      systemSubjects = createSystemSubjects(scene, data);
      if (onLoadComplete != null) {
        onLoadComplete();
      }
    }
  });

  function buildScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#000");

    return scene;
  }

  function buildRender({ width, height }) {
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
    renderer.setPixelRatio(DPR);
    renderer.setSize(width, height);

    renderer.gammaInput = true;
    renderer.gammaOutput = true;

    return renderer;
  }

  function buildCamera({ width, height }) {
    const aspectRatio = width / height;
    const fieldOfView = 60;
    const nearPlane = 0.0000000001;
    const farPlane = 5 * Math.pow(10, 13);
    const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
    camera.position.set(0, 0, 5);
    return camera;
  }

  function createSceneSubjects(scene) {
    const sceneSubjects = [
      new GeneralLights(scene),
      // new SceneSubject(scene),
      new SkyboxSubject(scene)
      //new GridSubject(scene)
    ];

    return sceneSubjects;
  }

  function createSystemSubjects(scene, data) {
    // Parent object is always the sun.
    console.log("creating system subjects")
    const sun = new SunBody(scene, renderer, data.parent);

    var planetaryObjects = [
      sun
    ];

    for (const body of data.bodies) {
      const orbitBody = new PlanetBody(scene, renderer, body);
      planetaryObjects.push(orbitBody);
    }

    return planetaryObjects;
  }

  function buildControls(camera, renderer) {
    controls = new OrbitControls( camera, renderer.domElement );
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set( 0, 0, 0 );
    controls.update();
  }

  this.registerControls = function() {
    // this.controls = buildControls(camera, renderer);
  }

  this.update = function() {
    const elapsedTime = clock.getElapsedTime();

    for(let i=0; i<sceneSubjects.length; i++)
      sceneSubjects[i].update(elapsedTime);

    this.currentTime = addDays(this.currentTime, 1);
    document.getElementById("ss-debug").innerHTML = this.currentTime.toString();
    //var days = (this.utcTimeMillis - (new Date(2000,0,1)).getTime()) / 3600 / 24 / 1000;
    
    for(let i=0; i<systemSubjects.length; i++)
      systemSubjects[i].update(this.currentTime);
    
    controls.update();
    renderer.render(scene, camera);
  }

  this.onWindowResize = function() {
    const { width, height } = canvas;

    screenDimensions.width = width;
    screenDimensions.height = height;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
  }
}