import * as THREE from "three";

// WIP
export async function main(target: HTMLElement) {
  const THREE = await import("three");
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(20, 1, 0.002, 1000);
  camera.rotation.x = -0.02 * (Math.random() * 0.5 + 0.5);
  camera.rotation.y = 0.02 * (Math.random() * 0.5 + 0.5);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  target.appendChild(renderer.domElement);
  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: "#ff00ff" }),
  );
  const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: "#ffff00" }),
  );
  cube.position.z = -2.1;
  cube2.position.z = -2.10001;
  cube2.position.x = -0.01;
  cube2.position.y = -0.01;
  scene.add(cube);
  scene.add(cube2);
  function render() {
    camera.rotation.x += 0.0000001;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();
}
