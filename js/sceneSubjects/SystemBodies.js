import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { PlanetOrbitController, OrbitController } from "/js/modules/OrbitController.js";
import { LabelController } from "/js/modules/LabelController.js";
import { OrbitSubject } from "/js/sceneSubjects/OrbitSubject.js";

export function SunBody(scene, renderer, params_in=null) {
    
    this.params = params_in || {};
    this.renderer = renderer;
    
    // Sphere texture
    this.texture = new THREE.TextureLoader().load(this.params.texture ? this.params.texture : "/assets/textures/sun.jpg");
    this.material = new THREE.MeshBasicMaterial( { map: this.texture } );
    
    // Positioning
    this.orbitController = new OrbitController(this);
    this.auRadius = this.orbitController.calculateAuRadius();

    // Sphere Mesh
    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(this.auRadius, 64, 32), this.material);

    this.makeTextSprite = function(message, font) {
        var _fontFamily = 'system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Liberation Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"';
        var _fontSize = 16;
        var _fontColor = 'white';
        var _oversampFactor = 7;

        if (typeof font !== "undefined") {
            if (typeof font.family !== "undefined")
                _fontFamily = font.family;
            if (typeof font.size !== "undefined")
                _fontSize = font.size;
            if (typeof font.color !== "undefined")
                _fontColor = font.color;
            if (typeof font.oversampFactor !== "undefined")
                _oversampFactor = font.oversampFactor;
        }
        _fontSize = _fontSize * _oversampFactor;

        var c1 = document.createElement('canvas');
        var ctx1 = c1.getContext('2d');
        ctx1.font = _fontSize + 'px ' + _fontFamily;

        var textMeasure = ctx1.measureText(message);
        var c = document.createElement('canvas');
        c.width = 2 * textMeasure.width + 20 * _oversampFactor;
        c.height = c.width;

        var ctx = c.getContext('2d');
        ctx.font = _fontSize + 'px ' + _fontFamily;
        ctx.fillStyle = _fontColor;
        ctx.fillText(message, 0, c.height / 2 + _fontSize / 2);

        var tex = new THREE.Texture(c);
        tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        tex.needsUpdate = true;
        
        var spriteMaterial = new THREE.SpriteMaterial({
            //scale: Math.floor(tex.image.width / _oversampFactor),
            sizeAttenuation: false,
            map: tex,
            transparent: true,
            depthTest: true,
            depthWrite: false
        });
        var sprite = new THREE.Sprite( spriteMaterial );
        sprite.scale.set( 0.1, 0.1, 1.0 );
        //sprite.center.set( 0,1 );
        return sprite;
    }

    this.update = function(dateTime) {
        // Here, use the values passed through the API with astronomy.js
        // to update the mesh's position and rotation.
        var coords = this.orbitController.calculatePosition(dateTime);
        //console.log(coords);
        this.mesh.position.set(coords.x, coords.z, coords.y);
        this.label.position.set(coords.x, coords.z, coords.y);
    }

    this.label = this.makeTextSprite(this.params.name);
    
    scene.add(this.mesh);
    scene.add(this.label);
}


export function PlanetBody(scene, renderer, params_in=null) {
    
    this.params = params_in || {};
    this.renderer = renderer;
    
    // Sphere texture
    this.texture = new THREE.TextureLoader().load(this.params.texture ? this.params.texture : "/assets/textures/sun.jpg");
    this.material = new THREE.MeshBasicMaterial( { map: this.texture } );
    
    // Positioning
    this.orbitController = new PlanetOrbitController(this);
    this.auRadius = this.orbitController.calculateAuRadius();

    // Sphere Mesh
    this.mesh = new THREE.Mesh(new THREE.SphereGeometry(this.auRadius, 64, 32), this.material);

    // Orbit Line
    this.orbitLine = new OrbitSubject(this, scene.currentTime);
    this.orbitLine.addToScene(scene);

    this.makeTextSprite = function(message, font) {
        var _fontFamily = 'system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Liberation Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"';
        var _fontSize = 16;
        var _fontColor = 'white';
        var _oversampFactor = 7;

        if (typeof font !== "undefined") {
            if (typeof font.family !== "undefined")
                _fontFamily = font.family;
            if (typeof font.size !== "undefined")
                _fontSize = font.size;
            if (typeof font.color !== "undefined")
                _fontColor = font.color;
            if (typeof font.oversampFactor !== "undefined")
                _oversampFactor = font.oversampFactor;
        }
        _fontSize = _fontSize * _oversampFactor;

        var c1 = document.createElement('canvas');
        var ctx1 = c1.getContext('2d');
        ctx1.font = _fontSize + 'px ' + _fontFamily;

        var textMeasure = ctx1.measureText(message);
        var c = document.createElement('canvas');
        c.width = 2 * textMeasure.width + 20 * _oversampFactor;
        c.height = c.width;

        var ctx = c.getContext('2d');
        ctx.font = _fontSize + 'px ' + _fontFamily;
        ctx.fillStyle = _fontColor;
        ctx.fillText(message, 0, c.height / 2 + _fontSize / 2);

        var tex = new THREE.Texture(c);
        tex.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
        tex.needsUpdate = true;
        
        var spriteMaterial = new THREE.SpriteMaterial({
            //scale: Math.floor(tex.image.width / _oversampFactor),
            sizeAttenuation: false,
            map: tex,
            transparent: true,
            depthTest: true,
            depthWrite: false
        });
        var sprite = new THREE.Sprite( spriteMaterial );
        sprite.scale.set( 0.1, 0.1, 1.0 );
        //sprite.center.set( 0,1 );
        return sprite;
    }

    this.update = function(dateTime) {
        // Here, use the values passed through the API with astronomy.js
        // to update the mesh's position and rotation.
        var coords = this.orbitController.calculatePosition(dateTime);
        //console.log(coords);
        this.mesh.position.set(coords.x, coords.z, coords.y);
        this.label.position.set(coords.x, coords.z, coords.y);
    }

    this.label = this.makeTextSprite(this.params.name);
    
    scene.add(this.mesh);
    scene.add(this.label);
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
