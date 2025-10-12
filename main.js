import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';

// Scene setup
const scene = new THREE.Scene();
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // Gravity!
scene.background = new THREE.Color(0x25254a); // Midnight Blue

// Stars
function addStars(numStars = 900) {
  for (let i = 0; i < numStars; i++) {
    const star = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 8, 8), // radius, width segments, height segments
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );

    // Random position in the sky
    const radius = 30 + Math.random() * 20;
    const theta = Math.random() * 2 * Math.PI;
    const phi = Math.random() * Math.PI / 2; // Only upper hemisphere
    star.position.x = radius * Math.cos(theta) * Math.sin(phi);
    star.position.y = radius * Math.cos(phi) + 10; // keep above ground
    star.position.z = radius * Math.sin(theta) * Math.sin(phi);
    scene.add(star);
  }
}
addStars(120);

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
  new THREE.MeshStandardMaterial({ color: 0x228B22 })
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Ground (Cannon.js physics)
const groundBody = new CANNON.Body({
  mass: 0, // static body
  shape: new CANNON.Plane(),
});
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
world.addBody(groundBody);

// Basic "Mushroom Man" (placeholder)
const mushroomGroup = new THREE.Group();

// Stem (Three.js)
const mushroomStem = new THREE.Mesh(
  new THREE.CylinderGeometry(0.3, 0.5, 1, 16),
  new THREE.MeshStandardMaterial({ color: 0xffc58f })
);
mushroomStem.position.y = 0;
mushroomGroup.add(mushroomStem);

// Cap (Three.js)
const mushroomCap = new THREE.Mesh(
  new THREE.SphereGeometry(1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2),
  new THREE.MeshStandardMaterial({ color: 0xd22b2b })
);
mushroomCap.position.y = 0.5;
mushroomGroup.add(mushroomCap);

scene.add(mushroomGroup);

// Mushroom physics (Cannon.js)
const mushroomShape = new CANNON.Sphere(0.5);
const mushroomBodyPhysics = new CANNON.Body({
  mass: 1,
  shape: mushroomShape,
  position: new CANNON.Vec3(0, 1, 0),
});
mushroomBodyPhysics.linearDamping = 0.9;
world.addBody(mushroomBodyPhysics);


// Simple keyboard controls for mushroom movement (arrows and WASD)
const keys = {};
window.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

function handlePlayerMovement() {
  const force = 10;
  const vel = mushroomBodyPhysics.velocity;

  if (keys['w'] || keys['arrowup']) vel.z = -force;
  else if (keys['s'] || keys['arrowdown']) vel.z = force;
  else vel.z = 0;

  if (keys['a'] || keys['arrowleft']) vel.x = -force;
  else if (keys['d'] || keys['arrowright']) vel.x = force;
  else vel.x = 0;
}

// Handle resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// TREESSSS
function addTree(x, z) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.7, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0x8b4513 })
  );
  trunk.position.set(x, 5, z);

  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(2, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0x228b22 })
  );
  leaves.position.set(x, 10, z);

  scene.add(trunk, leaves);

  // Add physics collider for trunk
  const treeShape = new CANNON.Cylinder(0.5, 0.7, 10, 8);
  const treeBody = new CANNON.Body({ mass: 0 });
  treeBody.addShape(treeShape);
  treeBody.position.set(x, 5, z);
  world.addBody(treeBody);
}
addTree(5, 3);
addTree(5, 5);

const timeStep = 1 / 60;

function animate() {
  requestAnimationFrame(animate);

  handlePlayerMovement();
  world.step(timeStep); // advance physics


  // Sync 3D model with physics
  mushroomGroup.position.copy(mushroomBodyPhysics.position);
  // If you want to offset the cap, you can adjust the children positions as before

  renderer.render(scene, camera);
}
animate();