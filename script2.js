// main.js
import World from './world.js';

// let a;
// a=new World("carl");
// a.greet();
// export default class MyClass {
//     // class definition
// }
let showDelta=0;

// sayHello();  // This will call the function from anotherFile.js


// Import SimplexNoise from the module (if using ES6 modules or CommonJS)
// import SimplexNoise from 'simplex-noise';

// SimplexNoise generator that accepts a seeded random number generator
function createSimplexNoise(seed) {
    // Create a seeded random number generator
    function seededRandom() {
        var x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

    // Create a Simplex noise instance with the seeded random function
    return new SimplexNoise(seededRandom);
}

// // Usage example
// const seed = 2837; // Your seed value
// const simplex1 = createSimplexNoise(seed);

// // Generate noise at some coordinates (x, y)
// const x = 0.5;
// const y = 0.5;
// const noiseValue = simplex1.noise2D(x, y);

// console.log(noiseValue); // This will output a consistent noise value for the given seed and coordinates

// const world = new World(12345);  // Your procedural world instance
// const chunkSize = world.chunkSize; 


let playerInfo={
    v:10,
    x:0,
    y:1,
    z:0
}


let cameraAngle=[0,0,0]


let lastMouseX=0;
let lastMouseY=0;



let xy=0;
let z=0

let mouseX = 0;
let mouseY = 0;
let isMouseDown = false;

let direction=false;
let camera;
camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 5);


let scene;
let renderer;
scene = new THREE.Scene();
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;
document.body.appendChild(renderer.domElement);



const listener = new THREE.AudioListener();
camera.add(listener);



const world = new World(2989283928398);  // Your procedural world instance
// world.generate3DTerrain(100,1)

const blockGeometry1 = new THREE.BoxGeometry(1, 1, 1);
const blockMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });

// Create an InstancedMesh with a maximum number of instances
const maxInstances = 125000; // Adjust based on the expected number of blocks
const instancedMesh = new THREE.InstancedMesh(blockGeometry1, blockMaterial, maxInstances);

// Matrix for transforming each instance
const matrix = new THREE.Matrix4();

// Counter to keep track of the number of instances
let instanceIndex = 0;
// ssh-keygen -t ed25519 -C "edisonhussey@gmail.com"

console.log(world.generate3DTerrain(50,50,50))
for(let i=0;i<50;i++){
    for(let j=0;j<50;j++){
        for(let k=0;k<50;k++){
            if(world.terrain[i][j][k]==1){
                matrix.setPosition(i,k,j)
                instancedMesh.setMatrixAt(instanceIndex, matrix)
            }
            instanceIndex++
        }

        // matrix.setPosition(i, world.terrain[i][j], j);
        // instancedMesh.setMatrixAt(instanceIndex, matrix);
        // instanceIndex++;
    }
}

scene.add(instancedMesh)





const blockGeometry = new THREE.BoxGeometry(1, 1, 1);
const materials = {
    'stone': new THREE.MeshBasicMaterial({ color: 0x888888 }),
    'dirt': new THREE.MeshBasicMaterial({ color: 0x654321 }),
    'air': null  // Air does not need to be rendered
};




// const world = new World(12345);  // Your procedural world instance
// const chunkSize = world.chunkSize;  // Assuming 16x16x16 chunks

// Create a cube geometry (block) and material
// const blockGeometry1 = new THREE.BoxGeometry(1, 1, 1);
// const blockMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });

// // Create an InstancedMesh with a maximum number of instances
// const maxInstances = 10000; // Adjust based on the expected number of blocks
// const instancedMesh = new THREE.InstancedMesh(blockGeometry1, blockMaterial, maxInstances);

// // Matrix for transforming each instance
// const matrix = new THREE.Matrix4();

// // Counter to keep track of the number of instances
// let instanceIndex = 0;

// Function to render a block at a specific global position (x, y, z)
function renderBlock(x, y, z) {
    const blockType = world.getBlock(x, y, z);
    // console.log(blockType)
    if (blockType !== 'air') {
        matrix.setPosition(x, y, z);
        instancedMesh.setMatrixAt(instanceIndex, matrix);
        instanceIndex++;
    }
}

// Render a section of the world
function renderWorldSection(startX, startY, startZ, endX, endY, endZ) {
    instanceIndex = 0; // Reset the instance index before rendering
    for (let x = startX; x < endX; x++) {
        for (let y = startY; y < endY; y++) {
            for (let z = startZ; z < endZ; z++) {
                renderBlock(x, y, z);
            }
        }
    }
    instancedMesh.instanceMatrix.needsUpdate = true; // Mark the instance matrix as needing an update
}

// Add the instanced mesh to the scene
// scene.add(instancedMesh);
// renderWorldSection(0,0,0,16,16,16)






const shootingSound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();

// Load the shooting sound buffer
audioLoader.load('pistolShot.mp3', function(buffer) {
    shootingSound.setBuffer(buffer);
    shootingSound.setLoop(false);
    shootingSound.setVolume(0.5);
});

let bulletList=[]

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });


// 1. Initialization
function init() {
    // setupScene();
    setupCamera();
    setupRenderer();
    setupLighting();
    loadAssets();
    setupInputHandlers();
    setupPhysics();
    setupHUD();
    animate();
}


const simplex = new SimplexNoise();

// Terrain generation
const size = 60; // Size of the terrain
const threshold = 0.5; // Noise threshold for cube generation

// Initialize the 3D matrix
const worldMatrix = [];

// Populate the world matrix using Simplex Noise
function generateWorldMatrix() {
    for (let x = 0; x < size; x++) {
        worldMatrix[x] = [];
        for (let y = 0; y < size; y++) {
            worldMatrix[x][y] = [];
            for (let z = 0; z < size; z++) {
                const noiseValue = simplex.noise3D(x / size, y / size, z / size);
                worldMatrix[x][y][z] = noiseValue > threshold;
            }
        }
    }
}

generateWorldMatrix();
const textureLoader1 = new THREE.TextureLoader();
const dirt=textureLoader1.load('dirt.png');

// const textureLoader = new THREE.TextureLoader();
//                     // const texture = textureLoader.load('dirt.png'); // URL to your texture
                    // const boxMaterial = new THREE.MeshBasicMaterial({ map: dirt });


                    // const box = new THREE.Mesh(boxGeometry, boxMaterial);


const frustum = new THREE.Frustum();
const cameraViewProjectionMatrix = new THREE.Matrix4();

// Assuming cubeSize is defined globally
const cubeSize = 1;
let visibleCubes = [];

function renderVisible() {
    // Clear previous visible cubes array and remove them from the scene
    visibleCubes.forEach(cube => scene.remove(cube));
    visibleCubes = [];

    // Update the frustum based on the current camera position
    camera.updateMatrixWorld(); // ensure camera matrices are up to date
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
    cameraViewProjectionMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(cameraViewProjectionMatrix);
    console.log(worldMatrix)
    // Iterate through the 3D world matrix
    for (let x = 0; x < worldMatrix.length; x++) {
        for (let y = 0; y < worldMatrix[x].length; y++) {
            for (let z = 0; z < worldMatrix[x][y].length; z++) {
                if (worldMatrix[x][y][z] !== false) {  // If there is a cube (non-zero value) at this position
                    // Calculate the cube's world position
                    const cubePosition = new THREE.Vector3(
                        x * cubeSize,
                        y * cubeSize,
                        z * cubeSize
                    );

                    // Create a bounding box for this cube
                    const box = new THREE.Box3().setFromCenterAndSize(
                        cubePosition,
                        new THREE.Vector3(cubeSize, cubeSize, cubeSize)
                    );

                    // Check if the bounding box is within the frustum
                    if (frustum.intersectsBox(box)) {
                        // Create or reuse a mesh for the visible cube
                        const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                        const cube = new THREE.Mesh(geometry, material);
                        cube.position.set(cubePosition.x, cubePosition.y, cubePosition.z);

                        // Add the cube to the scene and to the visibleCubes array
                        scene.add(cube);
                        visibleCubes.push(cube);
                    }
                    // if (frustum.intersectsBox(box)) {
                    //     // console.log(dirt)
                    //     // Create a mesh for the visible cube using the dirt texture
                    //     const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                    //     const cube = new THREE.Mesh(geometry, dirt);
                    //     cube.position.set(cubePosition.x, cubePosition.y, cubePosition.z);

                    //     // Add the cube to the scene and to the visibleCubes array
                    //     scene.add(cube);
                    //     visibleCubes.push(cube);
                    // }
                }
            }
        }
    }
}


// renderVisible();
function renderTerrain() {
    // Clear the scene
    while(scene.children.length > 0){ 
        scene.remove(scene.children[0]); 
    }

    const count = size * size * size; // Maximum number of instances
    const matrix = new THREE.Matrix4();
    const textureLoader = new THREE.TextureLoader();
    const boxMaterial = new THREE.MeshBasicMaterial({ map: dirt });

    // Create an instanced mesh
    const instancedMesh = new THREE.InstancedMesh(boxGeometry, boxMaterial, count);

    let instanceIndex = 0;

    // Iterate over the world matrix to set up instances
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            for (let z = 0; z < size; z++) {
                if (worldMatrix[x][y][z]) {
                    // Position the instance
                    matrix.setPosition(x - size / 2, y - size / 2, z - size / 2);
                    instancedMesh.setMatrixAt(instanceIndex, matrix);
                    instanceIndex++;
                }
            }
        }
    }

    // Add the instanced mesh to the scene
    scene.add(instancedMesh);
}
// renderTerrain();



// function renderTerrain() {
//     // Clear the scene
//     scene.clear();

//     // Create and add cubes based on the world matrix
//     for (let x = 0; x < size; x++) {
//         for (let y = 0; y < size; y++) {
//             for (let z = 0; z < size; z++) {
//                 if (worldMatrix[x][y][z]) {
//                     const textureLoader = new THREE.TextureLoader();
//                     // const texture = textureLoader.load('dirt.png'); // URL to your texture
//                     const boxMaterial = new THREE.MeshBasicMaterial({ map: dirt });


//                     const box = new THREE.Mesh(boxGeometry, boxMaterial);
//                     box.position.set(x - size / 2, y - size / 2, z - size / 2);
//                     scene.add(box);
//                 }
//             }
//         }
//     }
// }
// renderTerrain()

// function setupScene() {
    // scene = new THREE.Scene();
    // const gridHelper = new THREE.GridHelper(200, 50);
    // scene.add(gridHelper);

// }

function setupCamera() {
    // camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // camera.position.set(0, 1.5, 5);
}

function setupRenderer() {
    // renderer = new THREE.WebGLRenderer({ antialias: true });
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.toneMappingExposure = 1;
    // renderer.outputEncoding = THREE.sRGBEncoding;
    // document.body.appendChild(renderer.domElement);
}

function setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 10).normalize();
    scene.add(directionalLight);
}

// 2. Asset Loading
function loadAssets() {
    loadModel('tower.glb', createPlayer);
    loadModel('models/enemy.glb', createEnemy);
    loadTexture('textures/terrain.jpg', createEnvironment);
}

function loadModel(url, onLoadCallback) {
    const loader = new THREE.GLTFLoader();
    loader.load(url, function(gltf) {
        onLoadCallback(gltf.scene);
    });
}

function loadTexture(url, onLoadCallback) {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(url, function(texture) {
        onLoadCallback(texture);
    });
}

// 3. Game Objects and Entities
function createPlayer(model) {
    player = model;
    scene.add(player);
}

function createEnemy(model) {
    enemy = model;
    scene.add(enemy);
}

function createEnvironment(texture) {
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2;
    scene.add(plane);
}

function updateGameObjects(deltaTime) {
    updatePlayer(deltaTime);
    updateEnemies(deltaTime);
}
function createBullet() {
    const initialPosition = camera.position.clone(); // Start bullet at camera's position
    const bulletDirection = new THREE.Vector3(); // Direction the bullet will travel
    camera.getWorldDirection(bulletDirection);
    
    const bulletSpeed = 20; // Speed of the bullet
    const initialVelocity = bulletDirection.multiplyScalar(bulletSpeed); // Direction scaled by speed

    const bullet = new Bullet(initialPosition, initialVelocity, scene);
    bulletList.push(bullet); // Add the new bullet to the bullet list
}

function updateBullets(deltaTime) {
    // console.log(bulletList.length)
    bulletList.forEach((bullet, index) => {
        bullet.update(deltaTime);

        // Remove bullet if it is no longer alive
        if (!bullet.alive) {
            scene.remove(bullet.mesh); // Remove the bullet mesh from the scene
            bulletList.splice(index, 1); // Remove the bullet from the list
        }
    });
}

document.addEventListener('mousedown', () => { isMouseDown = true;
    
    
    createBullet()

    // sound.play();
    if (shootingSound.isPlaying) {
        shootingSound.stop();
    }

    // Play the sound for the new shot
    shootingSound.play();
});
document.addEventListener('mouseup', () => { isMouseDown = false; });


function getLookingAtPosition(distance = 1) {
    // Create a vector to store the direction
    const direction = new THREE.Vector3();

    // Get the direction the camera is looking at
    camera.getWorldDirection(direction);

    // Calculate the "looking at" position by adding the direction vector to the camera's position
    const lookingAtPosition = new THREE.Vector3();
    lookingAtPosition.copy(camera.position).add(direction.multiplyScalar(distance));

    return lookingAtPosition;
}

let yaw = 0;
let pitch = 0;

let xDirection=0
let zDirection=0

function rotateVector(x,z, angle) {
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    return {
        x: x * cosAngle - z * sinAngle,
        z: x * sinAngle + z * cosAngle
    };
}

class Jumper {
    constructor(gravity = -9.8, jumpVelocity = 50) {
        this.gravity = gravity;          // Gravitational acceleration (m/s^2)
        this.jumpVelocity = jumpVelocity; // Initial jump velocity (m/s)
        this.velocityY = 0;              // Current vertical speed
        this.jumping = false;            // Is the character currently jumping?
        this.autoJump = false;

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
    }

    // Start the jump if not already jumping
    startJump() {
        // console.log('hi')
        if (!this.jumping) {
            this.jumping = true;
            this.velocityY = this.jumpVelocity;
        }
    }

    // Update the vertical position and velocity
    update(deltaTime) {
        // console.log(this.moveLeft,this.jumping)

        // if(!this.jumping && this.autoJump){
            // this.startJump()
        // }
        // Normalize a and b
        if(this.autoJump && !this.jumping){
            this.startJump()
        }
        const magnitude = Math.sqrt(xDirection**2+zDirection**2);
        let xNorm = xDirection / magnitude;
        let zNorm = zDirection / magnitude;

        // console.log(this.jumping)
        if (this.jumping) {
            // Update vertical velocity based on gravity
            this.velocityY += this.gravity * deltaTime;

            // Update vertical position
            camera.position.y += this.velocityY * deltaTime;

            // Stop jumping if the velocity is below a threshold (or if the character lands)
            if (camera.position.y <= 0 ) {
                camera.position.y = 0;  // Ensure the camera doesn't go below ground level
                this.velocityY = 0;
                this.jumping = false;
            }
        }

        if(this.moveForward){
            if(this.moveRight){
                const values=rotateVector(xNorm,zNorm, Math.PI/4)
                camera.position.x+=values.x
                camera.position.z+=values.z
                

            }
            else if(this.moveLeft){
                const values=rotateVector(xNorm,zNorm, Math.PI*7/4)
                camera.position.x+=values.x
                camera.position.z+=values.z

            }else{
                camera.position.z+=zNorm
                camera.position.x+=xNorm

            }
        }
        else if(this.moveBackward){
            if(this.moveLeft){
                const values=rotateVector(xNorm,zNorm, Math.PI*5/4)
                camera.position.x+=values.x
                camera.position.z+=values.z

            }
            else if(this.moveRight){
                const values=rotateVector(xNorm,zNorm, Math.PI*3/4)
                camera.position.x+=values.x
                camera.position.z+=values.z

            }
            else{
                const values=rotateVector(xNorm,zNorm, Math.PI)
                camera.position.x+=values.x
                camera.position.z+=values.z

            }

        }
        if(this.moveLeft){
            const values=rotateVector(xNorm,zNorm, Math.PI*3/2)
                camera.position.x+=values.x
                camera.position.z+=values.z
        }
        if(this.moveRight){
            const values=rotateVector(xNorm,zNorm, Math.PI/2)
                camera.position.x+=values.x
                camera.position.z+=values.z
        }
    }
}


const jumper = new Jumper();

// Function to update camera direction based on yaw and pitch
function updateCameraDirection() {
    // Create a quaternion from yaw and pitch
    const quat = new THREE.Quaternion()
        .setFromEuler(new THREE.Euler(pitch, yaw, 0, 'YXZ'));

    // Apply quaternion to camera direction
    camera.quaternion.copy(quat);

    const lookAtPosition = getLookingAtPosition();
    const dx=lookAtPosition.x-camera.position.x
    const dz=lookAtPosition.z-camera.position.z
    xDirection=dx
    zDirection=dz
    
}

// Add an event listener to track mouse movement
document.addEventListener('mousemove', (event) => {
    // Get the change in mouse movement
    const deltaX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    const deltaY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    // Adjust yaw and pitch based on mouse movement
    yaw -= deltaX * 0.002; // Invert X axis for natural movement
    pitch -= deltaY * 0.002; // Y axis

    // Limit pitch to prevent camera flipping (90 degrees up/down)
    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));

    // Update the camera direction
    updateCameraDirection();
});

// Function to enable pointer lock (makes mouse cursor invisible and unrestricted)
function enablePointerLock() {
    const canvas = renderer.domElement;

    canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
    canvas.requestPointerLock();
}

// Add an event listener to detect pointer lock change
document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
document.addEventListener('webkitpointerlockchange', lockChangeAlert, false);

function lockChangeAlert() {
    if (document.pointerLockElement === renderer.domElement ||
        document.mozPointerLockElement === renderer.domElement ||
        document.webkitPointerLockElement === renderer.domElement) {
        console.log('The pointer is now locked');
    } else {
        console.log('The pointer lock is now disabled');
    }
}


document.addEventListener('click', enablePointerLock);

const particleCount = 1000; // Adjust this for more or fewer particles
const particles = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * 1000 - 500; // Spread particles over a large area
    const y = Math.random() * 500 - 250;
    const z = Math.random() * 1000 - 500;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
}

particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particleMaterial = new THREE.PointsMaterial({
    color: 0xaaaaaa, // Light color for a magical effect
    size: 2, // Adjust size as needed
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending, // Makes particles look like glowing lights
    map: new THREE.TextureLoader().load('particle3.png'), // Add a circular or glow texture
    depthWrite: false,
});

const particleSystem = new THREE.Points(particles, particleMaterial);
scene.add(particleSystem);

function animateParticles() {
    const positions = particleSystem.geometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += 0.1 * Math.sin(performance.now() * 0.001 + positions[i]); // Make particles float up and down
        if (positions[i + 1] > 250) positions[i + 1] = -250; // Loop particle positions
    }

    particleSystem.geometry.attributes.position.needsUpdate = true; // Mark geometry as needing update
}



function createExplosion(x, y, z) {
    const particleCount = 100; // Number of particles
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3); // x, y, z for each particle
    const velocities = new Float32Array(particleCount * 3); // x, y, z velocity for each particle
    const colors = new Float32Array(particleCount * 3); // r, g, b for each particle

    for (let i = 0; i < particleCount; i++) {
        // Set particle position
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Set random velocity for explosion effect
        velocities[i * 3] = (Math.random() - 0.5) * 2;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 2;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 2;

        // Set particle color (e.g., yellowish)
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 0.2;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 1.0
    });

    const particleSystem = new THREE.Points(particles, material);
    scene.add(particleSystem);

    // Animate the particle system
    let startTime = Date.now();
    function animateParticles() {
        let elapsed = (Date.now() - startTime) / 1000; // Time in seconds
        let positions = particleSystem.geometry.attributes.position.array;
        let velocities = particleSystem.geometry.attributes.velocity.array;
        let opacity = 1.0 - elapsed / 2.0; // Fade out over 2 seconds

        if (elapsed > 2) {
            // Remove particle system after 2 seconds
            scene.remove(particleSystem);
            return;
        }

        particleSystem.material.opacity = opacity;

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] += velocities[i * 3] * elapsed;
            positions[i * 3 + 1] += velocities[i * 3 + 1] * elapsed;
            positions[i * 3 + 2] += velocities[i * 3 + 2] * elapsed;
        }

        particleSystem.geometry.attributes.position.needsUpdate = true;
        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}

// Create an explosion at a given position (x, y, z)
function createExplosion2(x, y, z) {
    const particleCount = 1000;  // Number of particles
    const positions = new Float32Array(particleCount * 3);  // 3 values per vertex
    const velocities = [];  // Store velocities separately
    const colors = new Float32Array(particleCount * 3);  // Colors for each vertex

    // Geometry to hold the particles
    const geometry = new THREE.BufferGeometry();

    // Create particles with random positions and velocities
    for (let i = 0; i < particleCount; i++) {
        // Initial position
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Random velocity
        const velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 2,  // x direction
            (Math.random() - 0.5) * 2,  // y direction
            (Math.random() - 0.5) * 2   // z direction
        );
        velocity.normalize();  // Normalize to make it spherical
        velocity.multiplyScalar(Math.random() * 2);  // Scale velocity for variety

        velocities.push(velocity);

        // Color (optional): set color to orange with random brightness
        const color = new THREE.Color(0xffaa00).multiplyScalar(Math.random());
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    // Assign positions and colors to the geometry
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material for particles
    const material = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 1.0
    });

    // Create the particle system
    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);  // Add to scene

    const duration = 2;  // Duration of the explosion in seconds
    const startTime = Date.now();

    // Animate particles
    function animateParticles() {
        const elapsed = (Date.now() - startTime) / 1000;  // Time since start

        // Update particle positions
        for (let i = 0; i < particleCount; i++) {
            const velocity = velocities[i];
            positions[i * 3] += velocity.x * elapsed * 0.1;
            positions[i * 3 + 1] += velocity.y * elapsed * 0.1;
            positions[i * 3 + 2] += velocity.z * elapsed * 0.1;
        }

        // Update the positions and opacity
        geometry.attributes.position.needsUpdate = true;
        material.opacity = Math.max(1 - elapsed / duration, 0);

        // If time is up, stop the animation and remove the particle system
        if (elapsed >= duration) {
            scene.remove(particleSystem);
        } else {
            requestAnimationFrame(animateParticles);  // Continue animation loop
        }
    }

    // Start the animation
    animateParticles();
}// Start the animation

function createExplosion3(x, y, z) {
    const particleCount = 1000;  // Number of particles
    const positions = new Float32Array(particleCount * 3);  // 3 values per vertex
    const velocities = [];  // Store velocities separately
    const colors = new Float32Array(particleCount * 3);  // Colors for each vertex

    // Geometry to hold the particles
    const geometry = new THREE.BufferGeometry();

    // Create particles with non-uniform distribution
    for (let i = 0; i < particleCount; i++) {
        // Initial position
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Random spherical direction
        const theta = Math.random() * Math.PI * 2; // Random angle for x-y plane
        const phi = Math.acos(2 * Math.random() - 1); // Random angle for z

        const radius = Math.random(); // Random radius (for non-uniform distribution, you can change this)
        const velocity = new THREE.Vector3(
            radius * Math.sin(phi) * Math.cos(theta),
            radius * Math.sin(phi) * Math.sin(theta),
            radius * Math.cos(phi)
        );

        velocity.multiplyScalar(Math.random() * 2);  // Scale velocity for variety
        velocities.push(velocity);

        // Color (optional): set color to orange with random brightness
        const color = new THREE.Color(0xffaa00).multiplyScalar(Math.random());
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    // Assign positions and colors to the geometry
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material for particles
    const material = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 1.0
    });

    // Create the particle system
    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);  // Add to scene

    const duration = 2;  // Duration of the explosion in seconds
    const startTime = Date.now();

    // Animate particles
    function animateParticles() {
        const elapsed = (Date.now() - startTime) / 1000;  // Time since start

        // Update particle positions
        for (let i = 0; i < particleCount; i++) {
            const velocity = velocities[i];
            positions[i * 3] += velocity.x * elapsed * 0.1;
            positions[i * 3 + 1] += velocity.y * elapsed * 0.1;
            positions[i * 3 + 2] += velocity.z * elapsed * 0.1;
        }

        // Update the positions and opacity
        geometry.attributes.position.needsUpdate = true;
        material.opacity = Math.max(1 - elapsed / duration, 0);

        // If time is up, stop the animation and remove the particle system
        if (elapsed >= duration) {
            scene.remove(particleSystem);
        } else {
            requestAnimationFrame(animateParticles);  // Continue animation loop
        }
    }

    // Start the animation
    animateParticles();
}

function createElongatedExplosion(x, y, z) {
    const particleCount = 1000;  // Number of particles
    const positions = new Float32Array(particleCount * 3);  // 3 values per vertex
    const velocities = [];  // Store velocities separately
    const colors = new Float32Array(particleCount * 3);  // Colors for each vertex

    // Geometry to hold the particles
    const geometry = new THREE.BufferGeometry();

    for (let i = 0; i < particleCount; i++) {
        // Initial position
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Random spherical direction
        const theta = Math.random() * Math.PI * 2; // Random angle for x-y plane
        const phi = Math.acos(2 * Math.random() - 1); // Random angle for z

        // High initial velocity for elongation
        const initialVelocity = 10 + Math.random() * 5;  // High initial speed
        const velocity = new THREE.Vector3(
            initialVelocity * Math.sin(phi) * Math.cos(theta),
            initialVelocity * Math.sin(phi) * Math.sin(theta),
            initialVelocity * Math.cos(phi)
        );

        velocities.push(velocity);

        // Color: start bright and fade
        const color = new THREE.Color(0xffaa00).multiplyScalar(Math.random());
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material for particles (elongated in direction of motion)
    const material = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 1.0
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    const duration = 2;  // Duration of the explosion in seconds
    const startTime = Date.now();

    // Animate particles
    function animateParticles() {
        const elapsed = (Date.now() - startTime) / 1000;

        for (let i = 0; i < particleCount; i++) {
            const velocity = velocities[i];

            // Update position with decreasing velocity
            positions[i * 3] += velocity.x * elapsed * 0.1;
            positions[i * 3 + 1] += velocity.y * elapsed * 0.1;
            positions[i * 3 + 2] += velocity.z * elapsed * 0.1;

            // Gradually reduce the velocity for deceleration effect
            velocity.multiplyScalar(0.98);
        }

        geometry.attributes.position.needsUpdate = true;
        material.opacity = Math.max(1 - elapsed / duration, 0);

        if (elapsed >= duration) {
            scene.remove(particleSystem);
        } else {
            requestAnimationFrame(animateParticles);
        }
    }

    animateParticles();
}


function createElongatedExplosion2(x, y, z) {
    const particleCount = 1000;  // Number of particles
    const positions = new Float32Array(particleCount * 3);  // 3 values per vertex
    const velocities = [];  // Store velocities separately
    const colors = new Float32Array(particleCount * 3);  // Colors for each vertex
    const lifespans = [];  // Lifespan for each particle

    // Geometry to hold the particles
    const geometry = new THREE.BufferGeometry();

    for (let i = 0; i < particleCount; i++) {
        // Initial position
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Random spherical direction
        const theta = Math.random() * Math.PI * 2; // Random angle for x-y plane
        const phi = Math.acos(2 * Math.random() - 1); // Random angle for z

        // High initial velocity for elongation
        const initialVelocity = 10 + Math.random() * 5;  // High initial speed
        const velocity = new THREE.Vector3(
            initialVelocity * Math.sin(phi) * Math.cos(theta),
            initialVelocity * Math.sin(phi) * Math.sin(theta),
            initialVelocity * Math.cos(phi)
        );

        velocities.push(velocity);

        // Color: start bright and fade
        const color = new THREE.Color(0xffaa00).multiplyScalar(Math.random());
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        // Assign each particle a random lifespan between 0 and 2 seconds
        lifespans.push(Math.random() * 2);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material for particles (elongated in direction of motion)
    const material = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 1.0
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    const startTime = Date.now();

    // Animate particles
    function animateParticles() {
        const elapsed = (Date.now() - startTime) / 1000;

        for (let i = 0; i < particleCount; i++) {
            const velocity = velocities[i];
            const lifespan = lifespans[i];

            if (elapsed < lifespan) {
                // Update position with decreasing velocity
                positions[i * 3] += velocity.x * elapsed * 0.1;
                positions[i * 3 + 1] += velocity.y * elapsed * 0.1;
                positions[i * 3 + 2] += velocity.z * elapsed * 0.1;

                // Gradually reduce the velocity for deceleration effect
                velocity.multiplyScalar(0.98);
            } else {
                // Fade out the particle by reducing its opacity to 0
                colors[i * 3] = 0;
                colors[i * 3 + 1] = 0;
                colors[i * 3 + 2] = 0;
            }
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;

        if (elapsed < 2) {
            requestAnimationFrame(animateParticles);
        } else {
            scene.remove(particleSystem);
        }
    }

    animateParticles();
}

function createElongatedExplosion3(x, y, z) {
    const startTime=Date.now()
    const particleCount = 1000;  // Number of particles
    const positions = new Float32Array(particleCount * 3);  // 3 values per vertex
    const velocities = [];  // Store velocities separately
    const colors = new Float32Array(particleCount * 3);  // Colors for each vertex
    const opacities = new Float32Array(particleCount);  // Opacity for each vertex
    const lifespans = [];  // Lifespan for each particle
    const sizes = new Float32Array(particleCount);  
    // Geometry to hold the particles
    const geometry = new THREE.BufferGeometry();

    for (let i = 0; i < particleCount; i++) {
        // Initial position
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Random spherical direction
        const theta = Math.random() * Math.PI * 2; // Random angle for x-y plane
        const phi = Math.acos(2 * Math.random() - 1); // Random angle for z

        // High initial velocity for elongation
        const initialVelocity = 10 + Math.random() * 100;  // High initial speed
        const velocity = new THREE.Vector3(
            initialVelocity * Math.sin(phi) * Math.cos(theta),
            initialVelocity * Math.sin(phi) * Math.sin(theta),
            initialVelocity * Math.cos(phi)
        );

        velocities.push(velocity);

        // Color: start bright
        const color = new THREE.Color(0xffaa00).multiplyScalar(Math.random());
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        // Set initial opacity to 1 (fully visible)
        opacities[i] = 1.0;

        // Assign each particle a random lifespan between 0 and 2 seconds
        lifespans.push(Math.random() * 2);

        sizes[i] = Math.random() * 3;


    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Material for particles
    // const material = new THREE.PointsMaterial({
    //     size: 0.5,
    //     vertexColors: true,
    //     transparent: true,
    //     opacity: 1.0
    // });

    const material = new THREE.ShaderMaterial({
        uniforms: {
            pointTexture: { value: new THREE.TextureLoader().load('particle3.png') }
        },
        vertexShader: `
            attribute float size;
            attribute float opacity;
            varying float vOpacity;
            varying vec3 vColor;
    
            void main() {
                vColor = color;
                vOpacity = opacity;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform sampler2D pointTexture;
            varying float vOpacity;
            varying vec3 vColor;
    
            void main() {
                gl_FragColor = vec4(vColor, vOpacity);
                gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
            }
        `,
        transparent: true,
        vertexColors: true
    });



    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);


    // particlesData.sort((a, b) => b.distance - a.distance);

    let previousTime = Date.now();

    // Animate particles
    function animateParticles() {
        const currentTime = Date.now();
        const deltaTime = (currentTime - previousTime) / 1000;  // Convert ms to seconds
        previousTime = currentTime;

        const elapsed = (currentTime - startTime) / 1000;

        for (let i = 0; i < particleCount; i++) {
            const velocity = velocities[i];
            const lifespan = lifespans[i];

            if (elapsed < lifespan) {
                // Update position with exponential backoff on velocity
                const backoffFactor = Math.exp(-elapsed); // Exponential backoff factor
                positions[i * 3] += velocity.x * deltaTime * backoffFactor;
                positions[i * 3 + 1] += velocity.y * deltaTime * backoffFactor;
                positions[i * 3 + 2] += velocity.z * deltaTime * backoffFactor;

                // Gradually reduce the velocity for deceleration effect
                velocity.multiplyScalar(0.98);

                // Update opacity based on remaining lifespan
                opacities[i] = 1.0 - (elapsed / lifespan);  // Fade out as it approaches end of life
            } else {
                // Ensure the particle is completely transparent once it has expired
                opacities[i] = 0.0;
            }
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
        geometry.attributes.opacity.needsUpdate = true;

        if (elapsed < 5) {
            requestAnimationFrame(animateParticles);
        } else {
            scene.remove(particleSystem);
        }
    }

    animateParticles();
}

function createElongatedExplosion4(x, y, z) {
    const startTime = Date.now();
    const particleCount = 1000;  // Number of particles
    const positions = new Float32Array(particleCount * 3);  // 3 values per vertex
    const velocities = [];  // Store velocities separately
    const colors = new Float32Array(particleCount * 3);  // Colors for each vertex
    const opacities = new Float32Array(particleCount);  // Opacity for each vertex
    const lifespans = [];  // Lifespan for each particle
    const sizes = new Float32Array(particleCount);  
    const particlesData = [];

    // Geometry to hold the particles
    const geometry = new THREE.BufferGeometry();

    for (let i = 0; i < particleCount; i++) {
        // Initial position
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Random spherical direction
        const theta = Math.random() * Math.PI * 2; // Random angle for x-y plane
        const phi = Math.acos(2 * Math.random() - 1); // Random angle for z

        // High initial velocity for elongation
        const initialVelocity = 10 + Math.random() * 100;  // High initial speed
        const velocity = new THREE.Vector3(
            initialVelocity * Math.sin(phi) * Math.cos(theta),
            initialVelocity * Math.sin(phi) * Math.sin(theta),
            initialVelocity * Math.cos(phi)
        );

        velocities.push(velocity);

        // Color: start bright
        const color = new THREE.Color(0xffaa00).multiplyScalar(Math.random());
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        // Set initial opacity to 1 (fully visible)
        opacities[i] = 1.0;

        // Assign each particle a random lifespan between 0 and 2 seconds
        lifespans.push(Math.random() * 2);

        sizes[i] = Math.random() * 3;

        // Store particle data for sorting
        particlesData.push({
            index: i,
            distance: new THREE.Vector3(x, y, z).distanceTo(camera.position),
            velocity: velocity,
            lifespan: lifespans[i],
        });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Material for particles
    const material = new THREE.ShaderMaterial({
        uniforms: {
            pointTexture: { value: new THREE.TextureLoader().load('particle3.png') }
        },
        vertexShader: `
            attribute float size;
            attribute float opacity;
            varying float vOpacity;
            varying vec3 vColor;
    
            void main() {
                vColor = color;
                vOpacity = opacity;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            uniform sampler2D pointTexture;
            varying float vOpacity;
            varying vec3 vColor;
    
            void main() {
                gl_FragColor = vec4(vColor, vOpacity);
                gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
            }
        `,
        transparent: true,
        vertexColors: true
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    let previousTime = Date.now();

    // Animate particles
    function animateParticles() {
        const currentTime = Date.now();
        const deltaTime = (currentTime - previousTime) / 1000;  // Convert ms to seconds
        previousTime = currentTime;

        const elapsed = (currentTime - startTime) / 1000;

        // Update distance and sort particles by distance from the camera
        for (let i = 0; i < particleCount; i++) {
            particlesData[i].distance = new THREE.Vector3(
                positions[i * 3],
                positions[i * 3 + 1],
                positions[i * 3 + 2]
            ).distanceTo(camera.position);
        }

        particlesData.sort((a, b) => b.distance - a.distance);

        for (let i = 0; i < particleCount; i++) {
            const data = particlesData[i];
            const index = data.index;
            const velocity = data.velocity;
            const lifespan = data.lifespan;

            if (elapsed < lifespan) {
                // Update position with exponential backoff on velocity
                const backoffFactor = Math.exp(-elapsed);
                positions[index * 3] += velocity.x * deltaTime * backoffFactor;
                positions[index * 3 + 1] += velocity.y * deltaTime * backoffFactor;
                positions[index * 3 + 2] += velocity.z * deltaTime * backoffFactor;

                // Gradually reduce the velocity for deceleration effect
                velocity.multiplyScalar(0.98);

                // Update opacity based on remaining lifespan
                opacities[index] = 1.0 - (elapsed / lifespan);
            } else {
                // Ensure the particle is completely transparent once it has expired
                opacities[index] = 0.0;
            }
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
        geometry.attributes.opacity.needsUpdate = true;

        if (elapsed < 5) {
            requestAnimationFrame(animateParticles);
        } else {
            scene.remove(particleSystem);
        }
    }

    animateParticles();
}

class Bullet {
    constructor(position, velocity, scene) {
        this.position = position.clone(); // Start position of the bullet (Vector3)
        this.velocity = velocity.clone(); // Velocity of the bullet (Vector3)
        this.gravity = new THREE.Vector3(0, -9.8, 0); // Gravity vector
        this.alive = true;

        // Create a white sphere mesh to represent the bullet
        const geometry = new THREE.SphereGeometry(0.1, 8, 8); // Small sphere
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White color
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);

        // Add the mesh to the scene
        scene.add(this.mesh);
    }

    // Update the bullet's position
    update(deltaTime) {
        if (!this.alive) return;

        // Apply gravity to velocity
        this.velocity.add(this.gravity.clone().multiplyScalar(deltaTime));

        // Update position based on velocity
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));

        // Update the mesh position
        this.mesh.position.copy(this.position);

        // Check for collision with the ground or other objects
        if (this.position.y <= 0) {
            createElongatedExplosion3(this.position.x,this.position.y,this.position.z)
            this.alive = false;
            this.position.y = 0; // Ensure it doesn't go below ground
            // Handle collision (e.g., create impact effect)

            // Optionally remove the mesh from the scene if it's no longer needed
            this.mesh.visible = false;
        }
    }
}



function updatePlayer(deltaTime) {
    if(showDelta){
        console.log(deltaTime)
    }
    // console.log(deltaTime)



    updateBullets(deltaTime)
    jumper.update(deltaTime)
}

function updateEnemies(deltaTime) {
    // Enemy movement and AI
}

function updateObjects(deltaTime){

}

// 4. Physics and Collisions
function setupPhysics() {
    // Initialize physics engine
}

function updatePhysics(deltaTime) {
    // Update physics simulation
}

function checkCollisions() {
    // Handle collision detection and response
}

// 5. Input Handling
function setupInputHandlers() {
    window.addEventListener('keydown', onKeyDown, false);
    window.addEventListener('keyup', onKeyUp, false);
    
}

function handleInput(deltaTime) {
    // Process user input (e.g., keyboard, mouse)
}



function onKeyDown(event) {

    // renderVisible()

    switch (event.key) {
        case ' ':
            // jumper.startJump()
            // console.log('yo')
            jumper.autoJump=true
            break
        case 'w':
        case 'W':
            jumper.moveForward=true
     
            break;
        case 'a':
        case 'A':
            // console.log(a)
            jumper.moveLeft=true
            break;
        case 's':
        case 'S':
            jumper.moveBackward=true
            break;
        case 'd':
        case 'D':
            jumper.moveRight=true
            break;
        // case ' ':
        //     jumper.startJump()
        //     break
    }

}

function onKeyUp(event) {
    switch (event.key) {
        case 'ArrowUp':
        case 'w':

            jumper.moveForward=false
            break;
        case 'ArrowDown':
        case 's':
            jumper.moveBackward=false
            break;
        case 'ArrowLeft':
        case 'a':
            jumper.moveLeft=false
            break;
        case 'ArrowRight':
        case 'd':
            jumper.moveRight=false
            break;
        case ' ':
            // direction = false;
            console.log('lift')
            jumper.autoJump = false;
            break

    }
}

// 6. Game Logic
function gameLoop(deltaTime) {
    updateGameObjects(deltaTime);
    updatePhysics(deltaTime);
    checkCollisions();
    handleInput(deltaTime);
    render();
    checkGameOver();
}

function checkGameOver() {
    // Check for game over conditions
}

function restartGame() {
    // Reset game state for a new playthrough
}

// 7. Rendering
function render() {
    // renderVisible()
    renderer.render(scene, camera);
}

function applyPostProcessing() {
    // Apply post-processing effects
}

const clock = new THREE.Clock();
function animate() {
    requestAnimationFrame(animate);
    // console.log(camera.position)
    // const myChunk=world.getChunk(camera.position.x/8,camera.position.y/8,camera.position.z/8)
    // console.log(myChunk)
    // console.log(camera.position.x)
    // renderWorldSection(0,0,0,16,16,16)
    // renderWorldSection(camera.position.x+1,camera.position.y+1,camera.position.z+1,camera.position.x+17,camera.position.y+17,camera.position.z+17)
    // updateLine();
    animateParticles()
    const deltaTime = clock.getDelta(); // Assumes `clock = new THREE.Clock();`
    gameLoop(deltaTime);
    applyPostProcessing();
}

// 8. UI and HUD
function setupHUD() {
    // Initialize heads-up display
}

function updateHUD() {
    // Update HUD elements based on game state
}

function showGameOverScreen() {
    // Display the game over screen
}

// 9. Audio
function setupAudio() {
    // Initialize the audio system
}

function playSound(soundName) {
    // Play a sound effect
}

function playMusic(trackName) {
    // Play background music
}

// 10. Cleanup
function disposeAssets() {
    // Dispose of any loaded assets to free memory
}

function stopGame() {
    // Stop the game loop and perform cleanup
}

// Start the game
init();
