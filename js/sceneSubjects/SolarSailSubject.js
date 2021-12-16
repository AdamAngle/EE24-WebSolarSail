import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { odeHandler, CalculationHandler } from "/js/modules/CalculationHandler.js";
import { SolarSailOrbitSubject } from "/js/sceneSubjects/OrbitSubject.js";

export class SolarSailSubject {
    constructor(scene, renderer, params) {
        this.scene = scene;
        this.renderer = renderer;
        this.params = params;
        
        this.geometry = new THREE.ConeGeometry(
            this.params.sailRadius * 90000, this.params.height * 90000, this.params.radialSegments
        );
        this.material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        this.cone = new THREE.Mesh( this.geometry, this.material );
        this.scene.add( this.cone );

        this.orbitSubject = new SolarSailOrbitSubject(this);
        this.orbitSubject.addToScene(this.scene);

        this.isSimulationRunning = true;
        this.isSimulationPaused = false;

        this.initialTime = 0;
        this.previousResults = [];
    }

    startSimulation(time) {
        this.isSimulationRunning = true;
        this.initialTime = time;
    }

    update(time) {
        if (this.isSimulationRunning) {
            const positions = odeHandler.getSailPos(-1);
            var curVec = positions[0];
            this.cone.position.set(
                CalculationHandler.kmToAU(curVec[0]),
                CalculationHandler.kmToAU(curVec[2]),
                CalculationHandler.kmToAU(curVec[1])
            );
            this.orbitSubject.setVertices(positions);
        }
    }
}