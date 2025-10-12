
// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // light sky blue

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(0, 3, 8);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.position.set(5, 10, 7);
scene.add(sunLight);

// Ground
const groundTexture = new THREE.TextureLoader().load('assets/grass.jpg');
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(10, 10);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(50, 50),
  new THREE.MeshStandardMaterial({ map: groundTexture })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Basic "Mushroom Man" (placeholder)
const mushroomBody = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.8, 1.5, 16),
  new THREE.MeshStandardMaterial({ color: 0xffc58f })
);
mushroomBody.position.y = 0.75;
scene.add(mushroomBody);

const mushroomCap = new THREE.Mesh(
  new THREE.SphereGeometry(1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
  new THREE.MeshStandardMaterial({ color: 0xd22b2b })
);
mushroomCap.position.y = 1.5;
scene.add(mushroomCap);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Handle resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
