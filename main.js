
// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Light Blue 

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
  new THREE.MeshStandardMaterial({ color: 0x228B22 }) //Grass green
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Basic "Mushroom Man" (placeholder)
const mushroomBody = new THREE.Mesh(
    //top radius, bottom radius, height, radial segments
  new THREE.CylinderGeometry(0.3, 0.5, 1, 16), 
  new THREE.MeshStandardMaterial({ color: 0xffc58f })
);
mushroomBody.position.y = .5;
scene.add(mushroomBody);

const mushroomCap = new THREE.Mesh(
  new THREE.SphereGeometry(1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
  new THREE.MeshStandardMaterial({ color: 0xd22b2b })
);
mushroomCap.position.y = 1;
scene.add(mushroomCap);

// Handle resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// TREESSSS
function addTree(x, z) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, .7, 10, 8), // .3, .5 to make the trunk wider then taper up 
    new THREE.MeshStandardMaterial({ color: 0x8b4513 })
  );
  trunk.position.set(x, 1, z);

  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(2, 16, 16), 
    new THREE.MeshStandardMaterial({ color: 0x228b22 })
  );
  leaves.position.set(x, 6, z);

  scene.add(trunk, leaves);
}
addTree(5, 3);
addTree(5, 5);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();