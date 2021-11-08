import * as THREE from "https://cdn.skypack.dev/three@0.132.2";

export function SceneSubject(scene) {
	
	const radius = 2;
	const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 16), new THREE.MeshStandardMaterial({ flatShading: true }));

	mesh.position.set(0, 0, -20);

	scene.add(mesh);
	
	this.update = function(time) {
		const scale = Math.sin(time)+2;

		//mesh.scale.set(scale, scale, scale);
	}
}

export function GridSubject(scene) {
	
	var gridXZ = new THREE.GridHelper(1, 10);
    scene.add(gridXZ);
	
	this.update = function(time) {
		// Nothing needs to go here
	}
}