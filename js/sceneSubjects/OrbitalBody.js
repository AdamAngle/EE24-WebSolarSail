import * as THREE from "https://cdn.skypack.dev/three@0.132.2";

export function OrbitalBody(scene, params_in=null) {
	
    params = params_in ? params_in : {};
	const radius = 2;
	const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 16), new THREE.MeshStandardMaterial({ flatShading: true }));
    const texture = new THREE.TextureLoader().load(params["texture"]);

	mesh.position.set(0, 0, -20);

	scene.add(mesh);
	
	this.update = function(time) {
		const scale = Math.sin(time)+2;

		//mesh.scale.set(scale, scale, scale);
	}
}
