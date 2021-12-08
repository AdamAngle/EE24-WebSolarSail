import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { odeHandler } from "/js/modules/CalculationHandler.js";

export class SolarSailSubject {
    constructor(scene, renderer, params) {
        this.scene = scene;
        this.renderer = renderer;
        this.params = params;
        
        this.geometry = new THREE.ConeGeometry(
            this.params.sailRadius, this.params.height, this.params.radialSegments
        );
        this.material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        this.cone = new THREE.Mesh( this.geometry, this.material );
        this.scene.add( this.cone );

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
            if (!this.isSimulationPaused) {
                this.isSimulationPaused = true;
                odeHandler.getSailPos(-1);
                console.log(this.isSimulationPaused);
            }
        }
    }
}