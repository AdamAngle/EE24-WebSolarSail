import * as THREE from "https://cdn.skypack.dev/three@0.132.2";

export function SkyboxSubject(scene) {
	
	var geometry = new THREE.SphereGeometry(16384,60,40);
    geometry.applyMatrix4(new THREE.Matrix4().makeScale(-1, 1, 1));

    var textureLoader = new THREE.TextureLoader()
    var texture = textureLoader.load("/assets/textures/milkyway.jpg");
    texture.encoding = THREE.sRGBEncoding;
    var material = new THREE.MeshBasicMaterial( { map: texture } );

    var mesh = new THREE.Mesh(geometry, material);

    // Rotate the mesh to make the wrapped image upright
    var m = new THREE.Matrix4();
    //m.makeRotationY(3 * Math.PI / 2);
    //m.makeRotationX(-1.099);
    mesh.applyMatrix4(m);
    
    m = new THREE.Matrix4();
    //m.makeRotationY(Math.PI / 2);
    mesh.applyMatrix4(m);

    scene.add(mesh);
	
	this.update = function(time) {
		// Nothing needs to go here
	}
}