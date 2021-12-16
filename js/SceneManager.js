//import * as THREE from './libs/three.js'
import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import {GeneralLights} from "./sceneSubjects/GeneralLights.js";
import {SceneSubject, GridSubject} from "./sceneSubjects/SceneSubject.js";
import {SolarSailSubject} from "./sceneSubjects/SolarSailSubject.js";
import {SkyboxSubject} from "./sceneSubjects/SkyboxSubject.js";
import {SunBody, PlanetBody} from "./sceneSubjects/SystemBodies.js";
import { CalculationHandler } from "./modules/CalculationHandler.js";

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
  const navbar = document.getElementById("navbar-main");

  var controls;
  this.currentTime = new Date();
  buildControls(camera, renderer);

  const solarSailParams = {
    radialSegments: 8,
    sailRadius: CalculationHandler.mToAU(5),
    height: CalculationHandler.mToAU(5),
    rotationIncrement: 0.01,
    initialConeAngle: 1 // != 0
  }

  const sceneSubjects = createSceneSubjects(scene);
  var systemSubjects = [];

  this.solarSail = new SolarSailSubject(scene, renderer, solarSailParams);
  this.cameraLocked = true;
  this.detailedDebug = false;

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
    const farPlane = 5 * Math.pow(5, 13);
    const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
    camera.position.set(0, 0, 5);
    return camera;
  }

  function createSceneSubjects(scene) {
    const sceneSubjects = [
      //new GeneralLights(scene),
      // new SceneSubject(scene),
      new SkyboxSubject(scene),
      new GridSubject(scene)
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

  this.updateDebug = function() {
    document.getElementById("ss-debug").innerHTML = this.currentTime.toString();
    var text = `CAMERA MODE: Perspective (${this.cameraLocked ? 'FIXED' : 'FREE'})\n`;
    text += `SAIL POS (AU): (${this.solarSail.cone.position.x}, ${this.solarSail.cone.position.y}, ${this.solarSail.cone.position.z})\n`;
    text += `SAIL ROT (deg): (${this.solarSail.cone.rotation.x * 180 / Math.PI}, ${this.solarSail.cone.rotation.y * 180 / Math.PI}, ${this.solarSail.cone.rotation.z * 180 / Math.PI})\n`;
    if (this.detailedDebug) {
      text += `---- LAST 5 ODE VALUES (SOLAR SAIL): ----\n`;
      for (var i = 0; i < 5; i++) {
        text += `${i}: ${this.solarSail.orbitSubject.verts[i][0]} ${this.solarSail.orbitSubject.verts[i][2]} ${this.solarSail.orbitSubject.verts[i][1]}\n`;
      }
      this.solarSail.orbitSubject.vertices
    }
    document.getElementById("ss-debug-btm").innerHTML = text;
  }

  this.update = function() {
    this.currentTime = addDays(this.currentTime, 1);

    this.updateDebug();
    //var days = (this.utcTimeMillis - (new Date(2000,0,1)).getTime()) / 3600 / 24 / 1000;
    this.solarSail.update(this.currentTime);
    for(let i=0; i<systemSubjects.length; i++)
      systemSubjects[i].update(this.currentTime);

    for(let i=0; i<sceneSubjects.length; i++)
      sceneSubjects[i].update(this.currentTime);

    if(this.cameraLocked) {
      const conePos = this.solarSail.cone.position;
      controls.target.set(conePos.x, conePos.y, conePos.z);
    }
    
    controls.update();
    renderer.render(scene, camera);
  }

  this.onWindowResize = function() {
    const { width, height } = canvas;

    screenDimensions.width = width;
    screenDimensions.height = height - navbar.offsetHeight;

    camera.aspect = width / (height - navbar.offsetHeight);
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height - navbar.offsetHeight);
  }

  this.onKeyUp = function(event) {
    switch(event.key) {
      case "l":
        this.cameraLocked = !this.cameraLocked;
        break;
      case "p":
        this.detailedDebug = !this.detailedDebug;
        break;
      default:
        break;
    }
  }
}