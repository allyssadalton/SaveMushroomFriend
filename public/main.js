import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';

// Adds game clock
let hour = 21; 
let minute = 0;
var gameRunning = false;
const inventory = [];
let cheater = false;
let doorOpen = false;
let gameEnded = false;
let score = 0;
let gameStarted = false;
let gamePaused = false;
let gameRestart = false; 
let flashlightLight = null;
let hasFlashlight = false;
let nearbyItem = null;
const startScreen = document.getElementById("startScreen");
const pauseOverlay = document.getElementById("pauseOverlay");
const restartScreen = document.getElementById("restartScreen");
const inventoryItemAmount = document.getElementById("inventoryItemAmount");
const winnerWinner = document.getElementById("winnerWinner");
const loserLoser = document.getElementById("loserLoser");
const pickupPrompt = document.getElementById('pickupPrompt');
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

  if ((e.key === 'Z' || e.key === 'z') && cheater) {
  mushroomGroup.position.set(0, 0, 0);
  mushroomBodyPhysics.position.set(0, 1, 0);
  inventoryItemAmount.style.display = "none";
  cheater = false;
    
}
  
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
    gameEnded = true;
    const finalScore = inventory.length * 10;
    document.getElementById('clock').innerText = 'Game Over!';
    loserLoser.style.display = "flex"; // show win screen
    endGame(false, currentScore);

    //document.getElementById('finalScoreLoser').innerText = `Final Score: ${finalScore}`;
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
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && nearbyItem && gameRunning) {
    // Add to inventory
    inventory.push(nearbyItem.name || 'Item');

    // Flashlight special behavior
    if (nearbyItem.material?.map?.image?.src?.includes('flashlight.png') && !hasFlashlight) {
      hasFlashlight = true;
      flashlightLight = new THREE.PointLight(0xffffff, 5, 25);
      scene.add(flashlightLight);
    }

    // Remove from scene and list
    scene.remove(nearbyItem);
    const index = items.indexOf(nearbyItem);
    if (index !== -1) items.splice(index, 1);

    // Hide prompt and clear nearby reference
    pickupPrompt.style.display = 'none';
    nearbyItem = null;

    // Update inventory display
    updateInventoryDisplay();
  }
});



// Scene setup
const scene = new THREE.Scene();
const world = new CANNON.World();
// --- Physics materials ---
const mushroomMaterial = new CANNON.Material("mushroomMaterial");
const treeMaterial = new CANNON.Material("treeMaterial");

// Define contact behavior between mushroom and trees
const contactMaterial = new CANNON.ContactMaterial(mushroomMaterial, treeMaterial, {
  friction: 0.3,
  restitution: 0.9, // how “bouncy” the collision feels
});
world.addContactMaterial(contactMaterial);
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

function placeItemRandomly(mesh, treePositions) {
  let position;
  let tooClose;
  do {
    position = new THREE.Vector3(
      (Math.random() - 0.5) * 100, // adjust to map size
      0,
      (Math.random() - 0.5) * 100
    );
    tooClose = treePositions.some(treePos => treePos.distanceTo(position) < 5);
  } while (tooClose);

  mesh.position.copy(position);
}

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
const groundTexture = new THREE.TextureLoader().load('../assets/grass.jpg');
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
  material: mushroomMaterial,
});
mushroomBodyPhysics.linearDamping = 0.9;
world.addBody(mushroomBodyPhysics);

// Simple keyboard controls for mushroom movement (arrows and WASD)
const keys = {};
window.addEventListener('keydown', (e) => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', (e) => keys[e.key.toLowerCase()] = false);

function handlePlayerMovement() {
  const force = 20;
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
  // Camera-relative directions
  /*
  const forward = new CANNON.Vec3(Math.sin(cameraAngle), 0, Math.cos(cameraAngle));
  const right = new CANNON.Vec3(Math.cos(cameraAngle), 0, -Math.sin(cameraAngle));

  const move = new CANNON.Vec3(0, 0, 0);
  if (keys['w'] || keys['arrowup']) move.vsub(forward, move);
  if (keys['s'] || keys['arrowdown']) move.vadd(forward, move);
  if (keys['a'] || keys['arrowleft']) move.vsub(right, move);
  if (keys['d'] || keys['arrowright']) move.vadd(right, move);

  if (move.lengthSquared() > 0) {
    move.normalize();
    mushroomBodyPhysics.applyForce(move.scale(force), mushroomBodyPhysics.position);
  }
}
*/


// Handle resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});



// TREESSSS
const treeBodies = [];
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
  const treeBody = new CANNON.Body({
    mass: 0,
    material: treeMaterial,
  });
  treeBody.addShape(treeShape);
  treeBody.position.set(x, 5, z);
  world.addBody(treeBody);
  treeBodies.push(treeBody); // <--- store it

}



function updateInventoryDisplay() {
  const invDiv = document.getElementById('inventory');
  invDiv.innerText = `Inventory: ${inventory.length} / 11 items`;
}


const treePositions = treeBodies.map(tree => new THREE.Vector3(tree.position.x, tree.position.y, tree.position.z));

// --- ITEM SYSTEM ---
const items = [];
const itemCount = 10;

// Place flashlight once in front of mushroom
const textureLoader = new THREE.TextureLoader();
const flashlightTexture = textureLoader.load('../assets/flashlight.png');
// 🌲 Load tree bark texture
const treeBarkTexture = textureLoader.load('../assets/tree.png');
treeBarkTexture.wrapS = THREE.RepeatWrapping;
treeBarkTexture.wrapT = THREE.RepeatWrapping;
treeBarkTexture.repeat.set(1, 2); // tile vertically a bit

// --- Efficiently add many trees outside playable area using InstancedMesh ---
function addInstancedForestTrees() {
  const min = -155, max = 155;
  const playMin = -150, playMax = 150;
  const treeCount = 200; // Adjust for density

  // Trunk instancing
  const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.5, 8, 8);
  const trunkMaterial = new THREE.MeshStandardMaterial({
    map: treeBarkTexture,
  });
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
addDenseForest();
addInstancedForestTrees();
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
//mushroomGroup.add(flashlightMesh);
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
  const texture = textureLoader.load(`../assets/${filename}`);
  const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
  const geometry = new THREE.PlaneGeometry(1, 1.2);
  const itemMesh = new THREE.Mesh(geometry, material);

  // lift the item so it sits on the ground instead of halfway inside it
  itemMesh.position.y = 0.6; // = 0.6

  placeItemRandomly(itemMesh, treePositions);
  itemMesh.rotation.y = Math.random() * Math.PI * 2;
  scene.add(itemMesh);
  items.push(itemMesh);
}

updateInventoryDisplay();
// --- HOUSE WITH DOOR ---
const house = new THREE.Group();

// House body
const houseBody = new THREE.Mesh(
  new THREE.BoxGeometry(6, 4, 6),
  new THREE.MeshStandardMaterial({ color: 0x8b0000 }) // dark red walls
);
houseBody.position.y = 2; // lift off ground
house.add(houseBody);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(5, 3, 4),
  new THREE.MeshStandardMaterial({ color: 0x654321 }) // brown roof
);
roof.position.y = 5;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// Door
const doorGeometry = new THREE.BoxGeometry(1.8, 3, 0.2);
const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x4b3621 });
const door = new THREE.Mesh(doorGeometry, doorMaterial);
door.position.set(0, 1.5, 3.01); // center front of house
house.add(door);

// ✅ Set the new position
house.position.set(0, 0, -150);

scene.add(house);

function enterHouse() {
  gameEnded = true;
  gameRunning = false;
  
  
  // --- Calculate time elapsed since start (starts at 21:00) ---
  // Handle overnight wraparound (e.g., from 21 → 3am)
  let elapsedHours = hour >= 21
    ? (hour - 21) + (minute / 60)
    : (hour + 3) + (minute / 60); // since 24 - 21 = 3 hours past midnight

  // --- Clamp between 0 and 21 just for safety ---
  elapsedHours = Math.min(Math.max(elapsedHours, 0), 21);

  // --- Scoring system ---
  // 15.5 hours = £155
  // 21 hours  = £0
  // Anything faster than 15.5 earns >155 (optional cap)
  const maxHours = 21;
  const bestHours = 15.5;
  const maxScore = 155;

  let score = ((maxHours - elapsedHours) / (maxHours - bestHours)) * maxScore;
  score = Math.max(0, Math.min(score, maxScore)); // clamp to 0–155
  score = Math.round(score); // round for clean display
  score = inventory.length * 10;

  // --- Display results ---
  winnerWinner.style.display = "flex"; // show win screen
  //timeValue.innerText = `Time taken: ${elapsedHours.toFixed(1)} hours\nScore: ${score}`;
  endGame(true, currentScore);

  

}

function addDenseForest() {
  const areaSize = 150; // half-width of playable area
  const treeCount = 800; // increase for denser forest (try 1000+ if your GPU handles it)
  const minDistance = 3; // spacing so trees aren't too close

  const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.5, 8, 16);
  const trunkMaterial = new THREE.MeshStandardMaterial({
    map: treeBarkTexture,
  });
  const trunkMesh = new THREE.InstancedMesh(trunkGeometry, trunkMaterial, treeCount);

  const leavesGeometry = new THREE.SphereGeometry(1.8, 10, 10);
  const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
  const leavesMesh = new THREE.InstancedMesh(leavesGeometry, leavesMaterial, treeCount);

  const positions = [];
  const matrix = new THREE.Matrix4();

  for (let i = 0; i < treeCount; i++) {
    let x, z, tooClose;
    let attempts = 0;
    do {
      x = Math.random() * (areaSize * 2) - areaSize;
      z = Math.random() * (areaSize * 2) - areaSize;
      tooClose = false;
      // Prevent clustering too close to other trees
      for (const p of positions) {
        if (Math.hypot(p.x - x, p.z - z) < minDistance) {
          tooClose = true;
          break;
        }
      }
      attempts++;
    } while (tooClose && attempts < 10);
    positions.push({ x, z });

    // Random tree height & slight tilt for realism
    const scale = 0.8 + Math.random() * 0.6;
    const tiltX = (Math.random() - 0.5) * 0.1;
    const tiltZ = (Math.random() - 0.5) * 0.1;

    const trunkMatrix = new THREE.Matrix4();
    trunkMatrix.makeRotationFromEuler(new THREE.Euler(tiltX, Math.random() * Math.PI * 2, tiltZ));
    trunkMatrix.setPosition(x, 4 * scale, z);
    trunkMatrix.scale(new THREE.Vector3(scale, scale, scale));
    trunkMesh.setMatrixAt(i, trunkMatrix);

    // --- Create leaves transform (higher up) ---
    const leavesMatrix = new THREE.Matrix4();
    leavesMatrix.makeRotationFromEuler(new THREE.Euler(tiltX, Math.random() * Math.PI * 2, tiltZ));
    leavesMatrix.setPosition(x, (4 + 4 * scale) , z); // move leaves up
    leavesMatrix.scale(new THREE.Vector3(scale, scale, scale));
    leavesMesh.setMatrixAt(i, leavesMatrix);
  }
  const treeColliderShape = new CANNON.Cylinder(0.5, 0.7, 8, 8);
  for (let i = 0; i < treeCount; i++) {
    const { x, z } = positions[i];
    const treeBody = new CANNON.Body({
      mass: 0,
      material: treeMaterial,
    });
    treeBody.addShape(treeColliderShape);
    treeBody.position.set(x, 4, z);
    world.addBody(treeBody);
    treeBodies.push(treeBody);
  }

  trunkMesh.instanceMatrix.needsUpdate = true;
  leavesMesh.instanceMatrix.needsUpdate = true;
  scene.add(trunkMesh);
  scene.add(leavesMesh);
}


const timeStep = 1 / 120;
function checkTreeCollisions() {
  const bounceDistance = 2;

  for (const tree of treeBodies) {
    const dx = mushroomBodyPhysics.position.x - tree.position.x;
    const dz = mushroomBodyPhysics.position.z - tree.position.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < 2) { // roughly touching trunk
      const angle = Math.atan2(dz, dx);
      // Move mushroom back by 2 units along the collision normal
      mushroomBodyPhysics.position.x += Math.cos(angle) * bounceDistance;
      mushroomBodyPhysics.position.z += Math.sin(angle) * bounceDistance;

      // Optional: apply a little velocity pushback
      mushroomBodyPhysics.velocity.x = Math.cos(angle) * 5;
      mushroomBodyPhysics.velocity.z = Math.sin(angle) * 5;
    }
  }
  const treeColliderShape = new CANNON.Cylinder(0.5, 0.7, 8, 8);
function endGame(win, score) {
  const winnerScreen = document.getElementById("winnerWinner");
  const loserScreen = document.getElementById("loserLoser");
  const finalScoreWinner = document.getElementById("finalScoreWinner");
  const finalScoreLoser = document.getElementById("finalScoreLoser");

  if (win) {
    winnerScreen.style.display = "flex";
    finalScoreWinner.textContent = `Score: ${score}`;
  } else {
    loserScreen.style.display = "flex";
    finalScoreLoser.textContent = `Score: ${score}`;
  }
}

}
/*
function animate() {
  requestAnimationFrame(animate);

  handlePlayerMovement();
  world.step(timeStep);
  //checkTreeCollisions();

   const minX = -150, maxX = 150, minZ = -150, maxZ = 150;
   mushroomBodyPhysics.position.x = Math.max(minX, Math.min(maxX, mushroomBodyPhysics.position.x));
   mushroomBodyPhysics.position.z = Math.max(minZ, Math.min(maxZ, mushroomBodyPhysics.position.z));

  // Sync 3D model with physics
  mushroomGroup.position.copy(mushroomBodyPhysics.position);

  updateSkyAndCelestials();

  if (hasFlashlight && flashlightLight) {
    // Position flashlight slightly in front of the mushroom
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    flashlightLight.position.copy(mushroomGroup.position).add(dir.multiplyScalar(2));
  }
  nearbyItem = null;
  
  for (const item of items) {
    if (!item || !item.position) continue;
    const distance = mushroomGroup.position.distanceTo(item.position);
    if (distance < 2) { // near enough to pick up
      nearbyItem = item;
      pickupPrompt.style.display = 'block';
      break;
    }
  }
  if (!nearbyItem) pickupPrompt.style.display = 'none';
    if (item.name === 'flashlight.png') {
      hasFlashlight = true;

      // Create flashlight beam
      flashlightLight = new THREE.PointLight(0xffffff, 2, 15);
      scene.add(flashlightLight);
    }
  }

  for (const item of items) {
    item.lookAt(camera.position);
  }

  if (!doorOpen && !gameEnded) {
    const dx = mushroomBodyPhysics.position.x - house.position.x;
    const dz = mushroomBodyPhysics.position.z - (house.position.z + 3); // front face
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance < 2) { // near the door
      if (inventory.length < 11) { 
        inventoryItemAmount.style.display = "flex";
        cheater = true;
      } 
      else {
        doorOpen = true; // prevents this from re-triggering
        // Animate door opening only once
        let openProgress = 0;
        const openSpeed = 0.05;
        const doorOpenInterval = setInterval(() => {
          openProgress += openSpeed;
          door.rotation.y = -openProgress;

          if (door.rotation.y <= -Math.PI / 2) { // stop at 90 degrees
            clearInterval(doorOpenInterval);
            enterHouse();
          }
        }, 16);
        document.getElementById("finalScoreWinner").textContent = `Your final score: ${score}`;
        winnerWinner.style.display = "flex";
      }
    }

  }
  renderer.render(scene, camera);
  // --- Orbit camera around player when right mouse is held ---
  const camX = mushroomGroup.position.x + cameraRadius * Math.sin(cameraAngle);
  const camZ = mushroomGroup.position.z + cameraRadius * Math.cos(cameraAngle);
  camera.position.set(camX, mushroomGroup.position.y + 3, camZ);
  camera.lookAt(mushroomGroup.position);

}
*/
function animate() {
  requestAnimationFrame(animate);

  handlePlayerMovement();
  world.step(timeStep);

  // Limit play area boundaries
  const minX = -150, maxX = 150, minZ = -150, maxZ = 150;
  mushroomBodyPhysics.position.x = Math.max(minX, Math.min(maxX, mushroomBodyPhysics.position.x));
  mushroomBodyPhysics.position.z = Math.max(minZ, Math.min(maxZ, mushroomBodyPhysics.position.z));

  // Sync 3D model with physics
  mushroomGroup.position.copy(mushroomBodyPhysics.position);

  // Update environment lighting
  updateSkyAndCelestials();

  // --- Flashlight follow ---
  if (hasFlashlight && flashlightLight) {
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    flashlightLight.position.copy(mushroomGroup.position).add(dir.multiplyScalar(2));
  }

  // --- Nearby item detection (for space-bar pickup) ---
  nearbyItem = null;
  for (const item of items) {
    if (!item || !item.position) continue;
    const distance = mushroomGroup.position.distanceTo(item.position);
    if (distance < 2) { // near enough to pick up
      nearbyItem = item;
      pickupPrompt.style.display = 'block';
      break;
    }
  }
  if (!nearbyItem) {
    pickupPrompt.style.display = 'none';
  }

  // --- Make all items face the camera ---
  for (const item of items) {
    item.lookAt(camera.position);
  }

  // --- Door interaction ---
  if (!doorOpen && !gameEnded) {
    const dx = mushroomBodyPhysics.position.x - house.position.x;
    const dz = mushroomBodyPhysics.position.z - (house.position.z + 3);
    const distance = Math.sqrt(dx * dx + dz * dz);

    if (distance < 2) { // near the door
      if (inventory.length < 11) { 
        inventoryItemAmount.style.display = "flex";
        cheater = true;
      } else {
        doorOpen = true;
        let openProgress = 0;
        const openSpeed = 0.05;
        const doorOpenInterval = setInterval(() => {
          openProgress += openSpeed;
          door.rotation.y = -openProgress;

          if (door.rotation.y <= -Math.PI / 2) {
            clearInterval(doorOpenInterval);
            enterHouse();
          }
        }, 16);
        winnerWinner.style.display = "flex";
      }
    }
  }

  // --- Render and camera orbit ---
  renderer.render(scene, camera);

  const camX = mushroomGroup.position.x + cameraRadius * Math.sin(cameraAngle);
  const camZ = mushroomGroup.position.z + cameraRadius * Math.cos(cameraAngle);
  camera.position.set(camX, mushroomGroup.position.y + 3, camZ);
  camera.lookAt(mushroomGroup.position);
}

animate();

