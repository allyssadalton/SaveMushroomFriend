import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';

// Adds game clock
let hour = 21; 
let minute = 0;
var gameRunning = false;
const inventory = [];


let gameStarted = false;
let gamePaused = false;
let gameRestart = false;
const startScreen = document.getElementById("startScreen");
const pauseOverlay = document.getElementById("pauseOverlay");
const restartScreen = document.getElementById("restartScreen");

// --- Mouse camera control ---
let isRightMouseDown = false;
let previousMouseX = 0;
let cameraAngle = 0; // horizontal angle around the player
const cameraRadius = 7; // distance behind player


// Start game on any key press
window.addEventListener("keydown", (e) => {
  if (!gameStarted) {
    gameStarted = true;
    startScreen.style.display = "none";
    gameRunning = true;
    return;
  }

  // Toggle pause on ESC key
  if (e.key === "Escape") {
    gamePaused = !gamePaused;
    pauseOverlay.style.display = gamePaused ? "flex" : "none";
    gameRunning = !gamePaused;
    
  }

  if (e.key === 'R' || e.key === 'r' && gamePaused){
    gameRestart = true;
    pauseOverlay.style.display = "none";
    restartScreen.style.display = "flex";
  }

  if (e.key === '1' && gameRestart){
    gameRestart = false;
    restartScreen.style.display = "none";
    pauseOverlay.style.display = gamePaused ? "flex" : "none"; 
  }

  if (e.key === '0' && gameRestart){window.location.reload();}
});

// Game clock runs faster: 2 in-game hours = 1 real minute
setInterval(() => {
  if (!gameRunning) return;

  // Each real second = 2 in-game minutes
  minute += 2;

  if (minute >= 60) {
    hour += Math.floor(minute / 60);
    minute = minute % 60;
    if (hour >= 24) hour = 0;
  }

  // Stop at 6pm (18:00)
  if (hour === 18 && minute === 0) {
    gameRunning = false;
    document.getElementById('clock').innerText = 'Game Over!';
  }

  updateClockDisplay();
  updateSkyAndCelestials();
}, 1000);


function updateClockDisplay() {
  const pad = n => n.toString().padStart(2, '0');
  document.getElementById('clock').innerText = `${pad(hour)}:${pad(minute)}`;
}

// Mouse controls
window.addEventListener('mousedown', (e) => {
  if (e.button === 2) { // right mouse button
    isRightMouseDown = true;
    previousMouseX = e.clientX;
  }
});

window.addEventListener('mouseup', (e) => {
  if (e.button === 2) {
    isRightMouseDown = false;
  }
});

window.addEventListener('mousemove', (e) => {
  if (isRightMouseDown) {
    const deltaX = e.clientX - previousMouseX;
    previousMouseX = e.clientX;
    cameraAngle -= deltaX * 0.005; // sensitivity
  }
});

// prevent default right-click menu
window.addEventListener('contextmenu', (e) => e.preventDefault());





// Scene setup
const scene = new THREE.Scene();
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0); // Gravity!
scene.background = new THREE.Color(0x25254a); // Midnight Blue


// Sun (yellow sphere)
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xffee88 })
);
sun.position.set(0, 20, -30); // initial position, far in the sky
scene.add(sun);

// Moon (white sphere)
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(0.8, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xf0f8ff })
);
moon.position.set(0, 20, -30); // initial position, far in the sky
scene.add(moon);

// Sunlight (for day)
// --- Lighting Setup ---
const sunLight = new THREE.DirectionalLight(0xffffff, 0); // start off (night)
sunLight.position.set(5, 10, 7);
scene.add(sunLight);

const moonLight = new THREE.DirectionalLight(0x8899ff, 0.5); // cool blue tone for moonlight
moonLight.position.set(-5, 10, -7);
scene.add(moonLight);

const ambientLight = new THREE.AmbientLight(0x222244, 0.4); // dim night ambient
scene.add(ambientLight);


// --- Sky and Celestial Update Function ---
function updateSkyAndCelestials() {
  // Night: 9pm (21) to 5am (5)
  if (hour >= 21 || hour < 5) {
    scene.background.set(0x25254a); // night sky
    sun.visible = false;
    moon.visible = true;

    // Moon arc
    const t = ((hour >= 21 ? hour - 21 : hour + 3) * 60 + minute) / (8 * 60);
    const angle = Math.PI * (1 - t);
    moon.position.set(20 * Math.cos(angle), 15 + 10 * Math.sin(angle), -30);

    // Lighting adjustments
    sunLight.intensity = 0;
    moonLight.intensity = 0.6;
    ambientLight.color.set(0x222244);
    ambientLight.intensity = 0.5;

  } else if (hour >= 5 && hour < 18) {
    // Day: 5am to 6pm
    scene.background.set(0x87ceeb); // sky blue
    sun.visible = true;
    moon.visible = false;

    // Sun arc
    const t = ((hour - 5) * 60 + minute) / (13 * 60);
    const angle = Math.PI * t;
    sun.position.set(20 * Math.cos(angle), 15 + 10 * Math.sin(angle), -30);

    // Lighting adjustments
    sunLight.intensity = 1;
    moonLight.intensity = 0;
    ambientLight.color.set(0xffffff);
    ambientLight.intensity = 0.8;

  } else {
    // Evening: 6pm–9pm transition
    scene.background.set(0x2c2255);
    sun.visible = false;
    moon.visible = false;

    // Smooth lighting fade
    const eveningProgress = (hour - 18 + minute / 60) / 3;
    sunLight.intensity = Math.max(0, 1 - eveningProgress);
    moonLight.intensity = Math.min(0.6, eveningProgress * 0.6);
    ambientLight.intensity = 0.6 - eveningProgress * 0.2;
  }
}



// Stars
function addStars(numStars = 900) {
  const skyRadius = 400;   // How far away the stars are
  const skyThickness = 50; // Variation so they’re not on a perfect sphere
  const verticalBias = 0.2; // Bias stars upward (0–1)

  for (let i = 0; i < numStars; i++) {
    const star = new THREE.Mesh(
      new THREE.SphereGeometry(0.2, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );

    // Spherical coordinates
    const theta = Math.random() * 2 * Math.PI;            // around Y axis
    const phi = Math.acos(2 * Math.random() - 1);         // inclination for uniform sphere

    // Convert to Cartesian coordinates
    let x = Math.sin(phi) * Math.cos(theta);
    let y = Math.sin(phi) * Math.sin(theta);
    let z = Math.cos(phi);

    // Push stars upward slightly
    z = z * (1 - verticalBias) + verticalBias;

    // Scale to sky radius with some variation
    const radius = skyRadius + (Math.random() - 0.5) * skyThickness;
    star.position.set(x * radius, y * radius, z * radius);

    scene.add(star);
  }
}

addStars();
updateSkyAndCelestials();



// Camera setup
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.set(0, 3, 8);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ground
const groundTexture = new THREE.TextureLoader().load('assets/grass.jpg');
groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
groundTexture.repeat.set(10, 10);
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(500, 500),
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

  // Direction vector based on camera angle
  const forward = new CANNON.Vec3(
    Math.sin(cameraAngle),
    0,
    Math.cos(cameraAngle)
  );
  const right = new CANNON.Vec3(
    Math.cos(cameraAngle),
    0,
    -Math.sin(cameraAngle)
  );

  // Reset velocity each frame for smooth movement
  vel.x = 0;
  vel.z = 0;

  // Move relative to camera orientation
  if (keys['w'] || keys['arrowup']) {
    vel.x += -forward.x * force;
    vel.z += -forward.z * force;
  }
  if (keys['s'] || keys['arrowdown']) {
    vel.x += forward.x * force;
    vel.z += forward.z * force;
  }
  if (keys['a'] || keys['arrowleft']) {
    vel.x += -right.x * force;
    vel.z += -right.z * force;
  }
  if (keys['d'] || keys['arrowright']) {
    vel.x += right.x * force;
    vel.z += right.z * force;
  }
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

// --- Efficiently add many trees outside playable area using InstancedMesh ---
function addInstancedForestTrees() {
  const min = -155, max = 155;
  const playMin = -150, playMax = 150;
  const treeCount = 200; // Adjust for density

  // Trunk instancing
  const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.7, 10, 8);
  const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
  const trunkMesh = new THREE.InstancedMesh(trunkGeometry, trunkMaterial, treeCount);

  // Leaves instancing
  const leavesGeometry = new THREE.SphereGeometry(2, 16, 16);
  const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
  const leavesMesh = new THREE.InstancedMesh(leavesGeometry, leavesMaterial, treeCount);

  let instance = 0;
  for (let i = 0; i < treeCount; i++) {
    let x, z;
    // Only place trees outside the playable area
    do {
      x = Math.random() * (max - min) + min;
      z = Math.random() * (max - min) + min;
    } while (x > (playMin -1) && x < (playMax + 1) && z > (playMin -1) && z < (playMax + 1));

    const trunkMatrix = new THREE.Matrix4().setPosition(x, 5, z);
    trunkMesh.setMatrixAt(instance, trunkMatrix);

    const leavesMatrix = new THREE.Matrix4().setPosition(x, 10, z);
    leavesMesh.setMatrixAt(instance, leavesMatrix);

    instance++;
  }
  scene.add(trunkMesh);
  scene.add(leavesMesh);
}
addInstancedForestTrees();

function updateInventoryDisplay() {
  const invDiv = document.getElementById('inventory');
  invDiv.innerText = `Inventory: ${inventory.length} / 10 items`;
}
// --- ITEM SYSTEM ---
const items = [];
const itemCount = 10;

// Place flashlight once in front of mushroom
const textureLoader = new THREE.TextureLoader();
const flashlightTexture = textureLoader.load('assets/flashlight.png');

const flashlightMaterial = new THREE.MeshBasicMaterial({
  map: flashlightTexture,
  transparent: true,
  side: THREE.DoubleSide,
});

const flashlightGeometry = new THREE.PlaneGeometry(1, 1.2);
const flashlightMesh = new THREE.Mesh(flashlightGeometry, flashlightMaterial);

const offsetDistance = 2;
flashlightMesh.position.set(
  mushroomGroup.position.x + Math.sin(cameraAngle) * offsetDistance,
  0.6,
  mushroomGroup.position.z + Math.cos(cameraAngle) * offsetDistance
);

flashlightMesh.rotation.x = -Math.PI / 2;

scene.add(flashlightMesh);
items.push(flashlightMesh); // now works, items exists


// Load textures and place randomly
// Load textures and place randomly
const itemFiles = [
  'acorn.png',
  'crystal.png',
  'honey_jar.png',
  'leaf.png',
  'pebble.png',
  'rope.png',
  'snail_shell.png',
  'spiderweb.PNG',
  'spoon.png',
  'water.png'
];

for (const filename of itemFiles) {
  const texture = textureLoader.load(`assets/${filename}`);
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
  const geometry = new THREE.PlaneGeometry(1, 1.2);
  const itemMesh = new THREE.Mesh(geometry, material);

  const x = Math.random() * 300 - 150;
  const z = Math.random() * 300 - 150;
  itemMesh.position.set(x, 0.6, z);
  itemMesh.rotation.y = Math.random() * Math.PI * 2;

  scene.add(itemMesh);
  items.push(itemMesh);
}

updateInventoryDisplay();



const timeStep = 1 / 60;

function animate() {
  requestAnimationFrame(animate);

  handlePlayerMovement();
  world.step(timeStep); // advance physics

   const minX = -150, maxX = 150, minZ = -150, maxZ = 150;
   mushroomBodyPhysics.position.x = Math.max(minX, Math.min(maxX, mushroomBodyPhysics.position.x));
   mushroomBodyPhysics.position.z = Math.max(minZ, Math.min(maxZ, mushroomBodyPhysics.position.z));

  // Sync 3D model with physics
  mushroomGroup.position.copy(mushroomBodyPhysics.position);

  

  updateSkyAndCelestials();

  // Check for item pickups
  for (let i = items.length - 1; i >= 0; i--) {
    const item = items[i];
    const dx = mushroomGroup.position.x - item.position.x;
    const dz = mushroomGroup.position.z - item.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance < 1.5) { // pick-up radius
      scene.remove(item);     // remove from scene
      items.splice(i, 1);     // remove from array
      inventory.push(`Item ${inventory.length + 1}`); // add to inventory
      updateInventoryDisplay();
    }
  }

  for (const item of items) {
    item.lookAt(camera.position);
  }



  renderer.render(scene, camera);
  // --- Orbit camera around player when right mouse is held ---
  const camX = mushroomGroup.position.x + cameraRadius * Math.sin(cameraAngle);
  const camZ = mushroomGroup.position.z + cameraRadius * Math.cos(cameraAngle);
  camera.position.set(camX, mushroomGroup.position.y + 3, camZ);
  camera.lookAt(mushroomGroup.position);

}
animate();