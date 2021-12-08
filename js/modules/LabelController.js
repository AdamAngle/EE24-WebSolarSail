import * as THREE from "https://cdn.skypack.dev/three@0.132.2";

export class LabelController {
    fontFamily = 'Arial';
    fontSize = 12;
    fontColor = '#fff';
    sampleFactor = 7;

    constructor(params) {
        this._params = params;
        this._visible = true;

        this.sprite = this.makeTextSprite(this._params.name);
        sprite.position.copy();
        scene.add( sprite );
    }

    makeTextSprite(message, opts) {
        var parameters = opts || {};
        var fontface = parameters.fontface || 'Helvetica';
        var fontsize = parameters.fontsize || 120;
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.font = fontsize + "px " + fontface;
    
        // get size data (height depends only on font size)
        var metrics = context.measureText(message);
        var textWidth = metrics.width;
    
        // text color
        context.fillStyle = 'rgba(255, 255, 255, 1.0)';
        context.fillText(message, 0, fontsize);
    
        // canvas contents will be used for a texture
        var texture = new THREE.Texture(canvas)
        texture.minFilter = THREE.LinearFilter;
        texture.needsUpdate = true;
    
        var spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        var sprite = new THREE.Sprite( spriteMaterial );
        sprite.scale.set( 10, 5, 1.0 );
        sprite.center.set( 0,1 );
        return sprite;
    }

    /// <summary>
    /// Creates a label texture using a given name and font.
    /// (Adapted from "Three.js 'tutorials by example'" by Lee Stemkoski)
    /// </summary>
    createTexture(font) {
        var _fontFamily = 'Arial';
        var _fontSize = 20;
        var _fontColor = 'white';
        if (typeof font !== "undefined") {
            if (typeof font.family !== "undefined")
                _fontFamily = font.family;
            if (typeof font.size !== "undefined")
                _fontSize = font.size;
            if (typeof font.color !== "undefined")
                _fontColor = font.color;
        }
        _fontSize = _fontSize * 7;
        var c1 = document.createElement('canvas');
        var ctx1 = c1.getContext('2d');
        ctx1.font = _fontSize + 'px ' + _fontFamily;
        var textMeasure = ctx1.measureText(this._params.name);
        var c = document.createElement('canvas');
        c.width = 2 * textMeasure.width + 20 * 2;
        c.height = c.width;
        var ctx = c.getContext('2d');
        ctx.font = _fontSize + 'px ' + _fontFamily;
        ctx.fillStyle = _fontColor;
        ctx.fillText(this._params.name, 0, c.height / 2 + _fontSize / 2);
        var tex = new THREE.Texture(c);
        tex.anisotropy = this.renderer.getMaxAnisotropy();
        tex.needsUpdate = true;
        return tex;
    }

    getLabel(texture) {
        var label = new THREE.Vector3();
        var geometry = new THREE.BufferGeometry().setFromPoints([label]);
        
        var material = new THREE.PointsMaterial({
            size: Math.floor(texture.image.width),
            sizeAttenuation: false,
            map: texture,
            transparent: true,
            depthTest: true,
            depthWrite: false
        });
        var object = new THREE.Points(geometry,material);
        return object;
    }

    addToScene(scene) {
        scene.add(this.label);
    }

    setVisibility = function(visible) {
        this._visible = visible;
    }
}