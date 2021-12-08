import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { CalculationHandler } from "/js/modules/CalculationHandler.js";

// JPL Horizons definitions (fixed output quantities):
// a = semimajor axis
// ap = W = Arg Of Periapsis
// e = EC = eccentricity
// i = IN = inclination
// o = OM = Longitude of Ascending Node
// p = QR = periapsis distance
// LP = ML = mean longitude
// ML = mean anomaly
// ad = aD = daily motion
// ed = eD = daily eccentricity
// id = iD = daily inclination
// od = oD = daily longitude of ascending node
// tpjd = Tp = Periapsis time

export class OrbitSubject {
    // Default number of orbit ring line segments (more = smoother orbit line)
    orbitSegments = 250;

    constructor(body) {
        this._body = body;
        CalculationHandler.updateMeanElements((new Date()).getTime(), this._body);
        console.log(this._body.params.horizons.A)
        this.geometry = this.buildEllipticalGeometry(this._body.params.horizons.A, this._body.params.horizons.E);
        this.lsObject = new THREE.LineSegments(this.geometry, new THREE.LineBasicMaterial({
            color: "#f1f1f1",
            opacity: 1,
            linewidth: 1,
            fog: true
        }));
        this.rotateOrbitGeometry(this.lsObject);
    }

    addToScene(scene) {
        scene.add(this.lsObject);
    }

    buildEllipticalGeometry(a, e) {
        // Build a simple 2D geometry for the orbit, manipulating it later.
        console.log(a, e)
        // Calculation parameters
        var b = a * Math.sqrt(1 - e * e);
        var f = a * e;
        var step = Math.PI / this.orbitSegments / 2;
        var points = [];
        var i, x, y, xa;

        // Calculate position on ellipse for each segment
        for (i = 0; i <= this.orbitSegments; i++) {
            x = a * Math.cos(i * step);
            xa = x / a;
            y = b * Math.sqrt(1 - xa * xa);
            points.push([x, y]);
        }
        console.log(points)
        // Construct the geometry from the points
        const vertices = [];
        for (i = 0; i < points.length - 1; i++) {
            vertices.push(new THREE.Vector3(points[i][0] - f,0,points[i][1]));
            vertices.push(new THREE.Vector3(points[i + 1][0] - f,0,points[i + 1][1]));
            vertices.push(new THREE.Vector3(-points[i][0] - f,0,points[i][1]));
            vertices.push(new THREE.Vector3(-points[i + 1][0] - f,0,points[i + 1][1]));
            vertices.push(new THREE.Vector3(points[i][0] - f,0,-points[i][1]));
            vertices.push(new THREE.Vector3(points[i + 1][0] - f,0,-points[i + 1][1]));
            vertices.push(new THREE.Vector3(-points[i][0] - f,0,-points[i][1]));
            vertices.push(new THREE.Vector3(-points[i + 1][0] - f,0,-points[i + 1][1]));
        }
        return new THREE.BufferGeometry().setFromPoints(vertices);
    }

    rotateOrbitGeometry(geometry) {
        var horizons = this._body.params.horizons;
        var m2 = new THREE.Matrix4();
        m2.makeRotationY((horizons.O));
        geometry.applyMatrix4(m2);
        geometry.rotateOnAxis(new THREE.Vector3(1,0,0), (horizons.I));
        geometry.rotateOnAxis(new THREE.Vector3(0,1,0), (horizons.LP - horizons.O));
    }
}
