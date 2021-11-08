import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import {OrbitController} from "/js/modules/OrbitController.js";

export function StarBody(scene, params_in=null) {
    
    this.params = params_in ? params_in : {};
    
    this.texture = new THREE.TextureLoader().load(this.params.texture ? this.params.texture : "/assets/textures/sun.jpg");
    this.material = new THREE.MeshBasicMaterial( { map: this.texture } );
    
    this.orbitController = new OrbitController(this.params);
    this.auRadius = this.orbitController.calculateAuRadius();
    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(this.auRadius, 64, 32), this.material);
    

    scene.add(this.mesh);
    console.log(Astronomy);
    console.log(this.auRadius);
    this.update = function(dateTime) {
        // Here, use the values passed through the API with astronomy.js
        // to update the mesh's position and rotation.
        var coords = this.orbitController.calculatePosition(dateTime);
        console.log(coords);
        this.mesh.position.set(coords.x, coords.z, coords.y);
    }
}

export function BodyBody(scene, params_in=null) {
    
    this.params = params_in ? params_in : {};
    this.texture = new THREE.TextureLoader().load(this.params.texture ? this.params.texture : "/assets/textures/sun.jpg", (texture) => {
        this.mesh.material.map = texture;
        this.mesh.material.needsUpdate = true;
    });
    this.material = new THREE.MeshBasicMaterial( { map: this.texture } );
    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(this.params.radius ? this.params.radius : 1, 64, 32), this.material);

    scene.add(this.mesh);
    console.log(Astronomy)
    
    this.update = function(days) {
        // if (astronomyClass.hasOwnProperty(this.params.id)) {
        //     var otherBody = astronomyClass[this.params.id];
        //     var coords = otherBody.EclipticCartesianCoordinates(days);
        // } else {

        // }
        var coords = Astronomy.HelioVector(this.params.id, days);
        //console.log(coords);
        this.mesh.position.set(coords.x, coords.y, coords.z);
    }
    
    this.deg2rad = function(a) {
        return a * Math.PI / 180;
    }
    this.rad2deg = function(a) {
        return a * 180 / Math.PI;
    }
    
    this.getTEph = function(utcMillis) {
        return utcMillis / 86400000 + 2440587.5
    }
    
    this.getPlanetHeliocentricPosition = function(utcMillis, elements) {
        this.updateMeanElements(utcMillis, elements);
        return this.getObjectHeliocentricPosition(utcMillis, elements);
    }

    this.getObjectHeliocentricPosition = function(utcMillis, elements) {
        var omega = elements.lp - elements.o;
        var M = this.toNormalRange(elements.ml - elements.lp);
        var E = this.solveKepler(elements.e, M);
        var x = elements.a * (Math.cos(E) - elements.e);
        var y = elements.a * Math.sqrt(1 - elements.e * elements.e) * Math.sin(E);
        var xEcl = (Math.cos(omega) * Math.cos(elements.o) - Math.sin(omega) * Math.sin(elements.o) * Math.cos(elements.i)) * x + (-Math.sin(omega) * Math.cos(elements.o) - Math.cos(omega) * Math.sin(elements.o) * Math.cos(elements.i)) * y;
        var yEcl = (Math.cos(omega) * Math.sin(elements.o) + Math.sin(omega) * Math.cos(elements.o) * Math.cos(elements.i)) * x + (-Math.sin(omega) * Math.sin(elements.o) + Math.cos(omega) * Math.cos(elements.o) * Math.cos(elements.i)) * y;
        var zEcl = Math.sin(omega) * Math.sin(elements.i) * x + Math.cos(omega) * Math.sin(elements.i) * y;
        return {
            x: xEcl,
            y: yEcl,
            z: zEcl,
            r: Math.sqrt(x * x + y * y)
        };
    }

    this.updateMeanElements = function(utcMillis, elements) {
        var tEph = this.getTEph(utcMillis);
        var t = (tEph - 2451545) / 36525;
        elements.a = elements.a0 + elements.ad * t;
        elements.e = elements.e0 + elements.ed * t;
        elements.i = this.deg2rad(elements.i0 + elements.id * t);
        elements.ml = this.deg2rad(elements.ml0 + elements.mld * t);
        elements.lp = this.deg2rad(elements.lp0 + elements.lpd * t);
        elements.o = this.deg2rad(elements.o0 + elements.od * t);
    }

    this.solveKepler = function(e, M) {
        var threshold = this.deg2rad(1e-6);
        var dE;
        var E = M + e * Math.sin(M)
        do {
            dE = (M - E) / (1 - e * Math.cos(E));
            E = E + dE;
        } while (Math.abs(dE) > threshold);
        return E;
    }
    
    this.toNormalRange = function(angle) {
        var n = Math.floor(angle / 2 / Math.PI);
        var result = angle - n * 2 * Math.PI;
        if (result > Math.PI) {
            result = result - 2 * Math.PI;
        }
        return result;
    }
}
