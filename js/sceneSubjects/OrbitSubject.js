// JPL Horizons definitions (fixed output quantities):
// a = semimajor axis
// ap = W = Arg Of Periapsis
// e = EC = eccentricity
// i = IN = inclination
// o = OM = Longitude of Ascending Node
// p = QR = periapsis distance
// LP = ML = mean longitude
// ad = aD = daily motion
// ed = eD = daily eccentricity
// id = iD = daily inclination
// od = oD = daily longitude of ascending node
// tpjd = Tp = Periapsis time

export class OrbitSubject {
    // Default number of orbit ring line segments (more = smoother orbit line)
    orbitSegments = 200;

    constructor(scene, body) {
        console.log('orbitSubj')
        this._scene = scene;
        this._body = body;
        this.geometry = this.buildGeometry(this._body);
        this.lsObject = new THREE.LineSegments(this.geometry, new THREE.LineBasicMaterial({
            color: 0xffffff,
            linewidth: 2,
            opacity: 1
        }));
        rotateOrbitGeometry(this.geometry);
        this.scene.add(this.lsObject);
        
    }

    buildGeometry() {
        // Build a simple 2D geometry for the orbit, manipulating it later.

        // Body-specific values
        var horizons = this._body.params.horizons;
        var periapsis = horizons.W;
        var eccentricity = horizons.EC;

        // Calculation parameters
        var b = periapsis * Math.sqrt(1 - eccentricity * eccentricity);
        var step = 2 * Math.PI / this.orbitSegments;
        var points = [];
        var i, x, y, xa;

        // Calculate position on ellipse for each segment
        for (i = 0; i < this.orbitSegments; i++) {
            x = this.body.aD * Math.cos(i * step);
            xa = x / eccentricity;
            y = b * Math.sqrt(1 - xa * xa);
            points.push([x, y]);
        }
        
        // Construct the geometry from the points
        var geometry = new THREE.BufferGeometry();
        var pointsCount = points.length;
        for (i = 0; i < pointsCount; i++) {
            geometry.vertices.push(new THREE.Vector3(points[i][0] - f,0,points[i][1]));
            geometry.vertices.push(new THREE.Vector3(points[i + 1][0] - f,0,points[i + 1][1]));
            geometry.vertices.push(new THREE.Vector3(-points[i][0] - f,0,points[i][1]));
            geometry.vertices.push(new THREE.Vector3(-points[i + 1][0] - f,0,points[i + 1][1]));
            geometry.vertices.push(new THREE.Vector3(points[i][0] - f,0,-points[i][1]));
            geometry.vertices.push(new THREE.Vector3(points[i + 1][0] - f,0,-points[i + 1][1]));
            geometry.vertices.push(new THREE.Vector3(-points[i][0] - f,0,-points[i][1]));
            geometry.vertices.push(new THREE.Vector3(-points[i + 1][0] - f,0,-points[i + 1][1]));
        }
    }

    rotateOrbitGeometry(geometry) {
        var horizons = this._body.params.horizons;
        var m2 = new THREE.Matrix4();
        m2.makeRotationY((horizons.OM));
        geomtery.applyMatrix4(m2);
        geomtery.rotateOnAxis(new THREE.Vector3(1,0,0), (horizons.IN));
        geomtery.rotateOnAxis(new THREE.Vector3(0,1,0), (this._body.meanLongitude - horizons.OM));
    }
}
