// Set up the scene, camera, and renderer

const scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.setPixelRatio(window.devicePixelRatio);

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.outputEncoding = THREE.sRGBEncoding;

// Add an empty grid to provide some visual reference
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

// Set the camera's initial position
// camera.position.set(100, 100, 100);
camera.position.set(40, 1.5, 0);
// camera.lookAt(new THREE.Vector3(0, 1.5, -1)); 

// const SimplexNoise = window.SimplexNoise;
// const noise = new SimplexNoise(); 

// // Terrain parameters
// const terrainWidth = 256;
// const terrainHeight = 256;
// const scale = 10; // Scale of the noise
// const heightScale = 10; // Height multiplier

// Generate the terrain
// const terrainGeometry = new THREE.PlaneGeometry(terrainWidth, terrainHeight, terrainWidth - 1, terrainHeight - 1);
// const vertices = terrainGeometry.attributes.position.array;

// for (let i = 0; i < vertices.length; i += 3) {
//     let x = vertices[i];
//     let z = vertices[i + 2];
//     let noiseValue = noise.noise2D(x / scale, z / scale); // Use 2D noise
//     vertices[i + 1] = noiseValue * heightScale; // Update y (height) based on noise
// }

// terrainGeometry.computeVertexNormals(); // Update normals for correct lighting

// const terrainMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, flatShading: true });
// const terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial);
// terrainMesh.rotation.x = -Math.PI / 2; // Rotate to lay flat
// scene.add(terrainMesh);



// Add OrbitControls for free movement, but not centered on (0, 0, 0)
// const controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.target.set(50, 50, 50);  // Set a new target point away from the origin
// controls.update();

// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Color and intensity
// scene.add(ambientLight);


const controls = new THREE.FlyControls(camera, renderer.domElement);
controls.movementSpeed = 60;
controls.rollSpeed = Math.PI / 6;
controls.autoForward = false;
controls.dragToLook = true;



// const direction = new THREE.Vector3();
// const origin = new THREE.Vector3();
// const length = 50;
// const color = 0xff0000;


// const size = 256;
// const data = new Float32Array(size * size);
// for (let i = 0; i < size; i++) {
//     for (let j = 0; j < size; j++) {
//         data[i * size + j] = Math.random()*10;
//     }
// }

// const geometry = new THREE.PlaneGeometry(size, size, size - 1, size - 1);
// geometry.setAttribute('position', new THREE.BufferAttribute(data, 3));

// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
// const terrain = new THREE.Mesh(geometry, material);
// scene.add(terrain);

// const arrowHelper = new THREE.ArrowHelper(direction, origin, length, color);
// scene.add(arrowHelper);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // White light with intensity 1
// directionalLight.position.set(10, 10, 10).normalize();
// scene.add(directionalLight);

// const spotLight = new THREE.SpotLight(0xffffff, 1); // White light with intensity 1
// spotLight.position.set(10, 10, 10);
// spotLight.angle = Math.PI / 6; // Cone angle of the spotlight
// spotLight.penumbra = 0.1; // Soft edges of the light cone
// spotLight.decay = 2; // How the light diminishes over distance
// spotLight.distance = 200; // Maximum distance the light reaches
// scene.add(spotLight);

// const pointLight = new THREE.PointLight(0xffffff, 1, 100); // White light with intensity 1 and distance 100
// pointLight.position.set(10, 10, 10);
// scene.add(pointLight);

// Create a point light with white color and intensity 1

// const newLookAtPoint = new THREE.Vector3(0, 0, 0); // New point to look at
// camera.lookAt(newLookAtPoint); // Now the camera looks at this point




// const pointLight = new THREE.PointLight(0xffffff, 1, 1000); // White light with intensity 1 and distance 1000

// // Set the position of the light to 500 units high
// pointLight.position.set(0, 500, 0); // X = 0, Y = 500, Z = 0

// // Add the light to the scene
// scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xffffff, 10, 1000); // White light with intensity 1 and distance 1000

// Set the position of the light to 500 units high
pointLight2.position.set(500, 500, 500); // X = 0, Y = 500, Z = 0

// Add the light to the scene
scene.add(pointLight2);





// function updateCameraDirection() {
//     // Get the camera's direction vector
//     camera.getWorldDirection(direction);
    
//     // Update the arrow helper's direction
//     arrowHelper.setDirection(direction);
    
//     // Log the direction vector to the console
//     console.log('Camera Direction Vector:', direction);
// }

// function updateCameraDirection(a, b, c) {
//     // Create a new Vector3 to hold the direction
//     const direction = new THREE.Vector3();

//     // Get the world direction the camera is facing
//     camera.getWorldDirection(direction);

//     console.log('Camera Direction:', direction);

//     // Calculate the new target position
//     const targetPosition = new THREE.Vector3(
//         camera.position.x + direction.x + a, 
//         camera.position.y + direction.y + b, 
//         camera.position.z + direction.z + c
//     );

//     // Update the camera's direction to look at the new target position
//     camera.lookAt(targetPosition);
// }

function moveCameraRight(amount) {
    // Create vectors for direction
    const right = new THREE.Vector3();
    const up = new THREE.Vector3(0, 1, 0); // Camera's up direction

    // Get the current forward direction of the camera
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);

    // Calculate the right vector by taking the cross product of the up vector and forward vector
    right.crossVectors(up, forward).normalize();

    // Calculate the new target position by moving right
    const targetPosition = new THREE.Vector3().addVectors(
        camera.position,
        right.multiplyScalar(amount)
    );

    // Update the camera to look at the new target position
    camera.lookAt(targetPosition);
}


function drawLineSegments(scene, lineData, color = 0xffffff) {
    const points = [];
    
    // Push all points for the line segments
    for (const line of lineData) {
        points.push(new THREE.Vector3(line.start.x, line.start.y, line.start.z));
        points.push(new THREE.Vector3(line.end.x, line.end.y, line.end.z));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: color });

    const lineSegments = new THREE.LineSegments(geometry, material);
    scene.add(lineSegments);

    return lineSegments;
}

// const loader = new THREE.TextureLoader();
// const texture = loader.load('image.jpg');
// scene.background = texture;

// const skyGeometry = new THREE.SphereGeometry(1000, 32, 32);
// const skyMaterial = new THREE.ShaderMaterial({
//     uniforms: { 
//         topColor: { value: new THREE.Color(0x0077ff) },
//         bottomColor: { value: new THREE.Color(0xffffff) },
//         offset: { value: 33 },
//         exponent: { value: 0.6 }
//     },
//     vertexShader: `
//         varying vec3 vWorldPosition;
//         void main() {
//             vec4 worldPosition = modelMatrix * vec4(position, 1.0);
//             vWorldPosition = worldPosition.xyz;
//             gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//         }
//     `,
//     fragmentShader: `
//         uniform vec3 topColor;
//         uniform vec3 bottomColor;
//         uniform float offset;
//         uniform float exponent;
//         varying vec3 vWorldPosition;
//         void main() {
//             float h = normalize(vWorldPosition + offset).y;
//             gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
//         }
//     `,
//     side: THREE.BackSide
// });

// const sky = new THREE.Mesh(skyGeometry, skyMaterial);
// scene.add(sky);

// const floorGeometry = new THREE.PlaneGeometry(200, 200); // Adjust size based on your scene scale
// const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); // White floor
// const floor = new THREE.Mesh(floorGeometry, floorMaterial);
// floor.rotation.x = - Math.PI / 2;
// scene.add(floor);

let tower;

const loader = new THREE.GLTFLoader();
        loader.load(
            'tower.glb', 
            function (gltf) {
                // scene.add(gltf.scene); // Add the model to the scene
                gltf.scene.position.set(0, 0, 0); // Position the model
                // model.scale.set(100, 100, 100);
                
                const model =gltf.scene
                tower=gltf.scene

                model.traverse(function (child) {
                    if (child.isMesh) {
                        // Access the material
                        const material = child.material;
        
                        // Log the material properties for debugging
                        console.log('Material:', material);
        
                        // Check if material has a color or map (texture)
                        if (material.map) {
                            console.log('Texture:', material.map);
                        }
        
                        // Optional: Modify the material properties if needed
                        // material.color.set(0xff0000); // Example: change the color to red
                        // material.wireframe = true; // Example: enable wireframe mode
                    }
                });

                scene.add(tower);

                // const bbox = new THREE.BoxHelper(model, 0xff0000);
                // scene.add(bbox);
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error) {
                console.error('An error occurred:', error);
            }
        );


// Create the set of line segments
let LineSet = [];
let lineData = [];

for(let i = 0; i < 50; i++){
    for(let j = 0; j < 50; j++){
        for(let k = 0; k < 50; k++){
            let p = { x: 10*i, y: 10*j, z: 10*k };
            let p1 = { x: 10*i + 10, y: 10*j, z: 10*k };
            let p2 = { x: 10*i, y: 10*j + 10, z: 10*k };
            let p3 = { x: 10*i, y: 10*j, z: 10*k + 10 };
            const randomVar=Math.random()
            if(randomVar<0.2){
                lineData.push({ start: p, end: p1 });
            }
            const randomVar1=Math.random()
            const randomVar2=Math.random()
            if(randomVar<0.2){
                lineData.push({ start: p, end: p2 });
            }
            if(randomVar<0.2){
                lineData.push({ start: p, end: p3 });
            }
            // lineData.push({ start: p, end: p1 });
            // lineData.push({ start: p, end: p2 });
            // lineData.push({ start: p, end: p3 });
        }
    }
}

function getMousePosition(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

window.addEventListener('mousemove', getMousePosition);

// Draw all the lines as a single line segment
// LineSet.push(drawLineSegments(scene, lineData, 0xff0000));





// const missile = new Missile({ x: 0, y: 0, z: 0 }, 0xff0000);
// missile.addToScene(scene);

class CameraMover {
    constructor(camera, duration = 3000) {
        this.camera = camera;
        this.duration = duration; // Duration of the movement in milliseconds
        this.moveInProgress = false;
        this.startTime = 0;
        this.initialPosition = new THREE.Vector3();
        this.deltaPosition = new THREE.Vector3();
        this.targetPosition = new THREE.Vector3();
    }

    moveTo(newTargetPosition) {
        this.moveInProgress = true;
        this.startTime = performance.now(); // Record the start time
        this.initialPosition.copy(this.camera.position); // Save the initial position
        this.targetPosition.copy(newTargetPosition); // Set the new target position
        this.deltaPosition.subVectors(this.targetPosition, this.initialPosition); // Calculate the change in position
    }

    update() {
        if (this.moveInProgress) {
            const now = performance.now();
            const elapsed = now - this.startTime;
            const progress = Math.min(elapsed / this.duration, 1); // Calculate progress

            // Calculate the new position using exponential easing
            this.camera.position.set(
                this.ease(progress, this.initialPosition.x, this.deltaPosition.x),
                this.ease(progress, this.initialPosition.y, this.deltaPosition.y),
                this.ease(progress, this.initialPosition.z, this.deltaPosition.z)
            );

            // If done, complete the movement
            if (progress >= 1) {
                this.moveInProgress = false;
                this.camera.position.copy(this.targetPosition); // Ensure camera reaches the exact target position
            }
        }
    }

    // Exponential easing function
    ease(t, b, c) {
        const p = this.duration * 0.3;
        const s = p / 4;
        const a = c;
        return (a * Math.pow(2, -10 * t / this.duration) * Math.sin((t - s) * (2 * Math.PI) / p) + c + b);
    }
}

const cameraMover = new CameraMover(camera, 3000);


const clock = new THREE.Clock();



const startPosition = new THREE.Vector3(0, 0, 0); // Position A
const endPosition = new THREE.Vector3(400, 400, 400); // Position B
const duration = 5; // Duration in seconds
let elapsedTime = 0;


let globalDirection="none"

let mouseX;
let mouseY;

function handleArrowKeyPress(event) {
    switch (event.key) {
        case "ArrowUp":
            camera.position.z+=100
            globalDirection="up"
            break;
        case "ArrowDown":
            globalDirection="down"
            break;
        case "ArrowLeft":
            globalDirection="left"
            break;
        case "ArrowRight":
            globalDirection="right"
            break;
    }
}

window.addEventListener("keydown", handleArrowKeyPress);


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function updateRaycaster() {
    // Get the mouse position
    const mousePosition = getMousePosition();
    mouse.set(mousePosition.x, mousePosition.y);
    
    // Update raycaster with mouse position
    raycaster.setFromCamera(mouse, camera);
    
    // Check for intersections with objects in the scene
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        // Handle intersection
        console.log('Intersected object:', intersects[0].object);
    }
}


function animate() {

    // elapsedTime += clock.getDelta();
    
    // // Calculate progress (0 to 1)
    // const t = elapsedTime / duration;
    // if(t<1){
    
    // // Apply exponential easing (ease-out)
    // const easing = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

    // // Interpolate between start and end positions using easing value
    // camera.position.lerpVectors(startPosition, endPosition, easing);

    // // Retain camera's direction or look at a specific target
    // camera.lookAt(0, 0, 0); // Optional: keep looking at origin or another target
    // }

    // Render the scene
    // renderer.render(scene, camera);


    requestAnimationFrame(animate);

    updateRaycaster();
    // camera.lookAt(new THREE.Vector3(0,0,0))
    // cameraMover.update();
    // camera.position.x+=0.1
    // camera.position.z+=0.1
    // camera.position.y+=0.01
    switch(globalDirection){
        case "up":
            // tower.position.z-=0.5
            // updateCameraDirection(10,0,0.1)

            break
        case "down":
            // tower.position.z+=0.5
            // updateCameraDirection(-100,0,1)
            break

        case "right":
            // tower.position.x+=0.5
            // moveCameraRight(0.0001)
            break

        case "left":
            // tower.position.x-=0.5
            // updateCameraDirection(0,0,1)
            break
    }
    // tower.position.x+=0.03
    // updateCameraDirection()
    const delta = clock.getDelta();
    // controls.update(delta);
    renderer.render(scene, camera);
}

// function moveCameraWithDirection(camera, startPos, endPos, endDirection, duration) {
//     const clock = new THREE.Clock();
//     let elapsedTime = 0;
    
//     // Get the initial camera direction
//     const startDirection = new THREE.Vector3();
//     camera.getWorldDirection(startDirection);
    
//     function animateCamera() {
//         requestAnimationFrame(animateCamera);
        
//         // Update elapsed time
//         elapsedTime += clock.getDelta();
        
//         // Calculate progress (0 to 1)
//         const t = Math.min(elapsedTime / duration, 1);
        
//         // Apply exponential easing (ease-out)
//         const easing = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        
//         // Interpolate between start and end positions using easing value
//         camera.position.lerpVectors(startPos, endPos, easing);
        
//         // Interpolate between start and end directions using easing value
//         const currentDirection = new THREE.Vector3();
//         currentDirection.lerpVectors(startDirection, endDirection, easing);
        
//         // Set the camera to look in the interpolated direction
//         camera.lookAt(camera.position.clone().add(currentDirection));
        
//         // Render the scene
//         renderer.render(scene, camera);
        
//         // Stop the animation once the camera reaches the target
//         if (t >= 1) {
//             cancelAnimationFrame(animateCamera);
//         }
//     }

//     // Start the animation
    // animateCamera();
// }

// const startPosition = new THREE.Vector3(0, 0, 0); // Start position A
// const endPosition = new THREE.Vector3(400, 400, 400); // End position B
// const endDirection = new THREE.Vector3(-1, -1, 0).normalize(); // Direction to look at after reaching B
// const duration = 5; // Time in seconds to move from A to B

// moveCameraWithDirection(camera, startPosition, endPosition, endDirection, duration);



// // Animation loop
// function animate() {
//     requestAnimationFrame(animate);
//     controls.update();  // Only necessary if controls.enableDamping = true, or if controls.autoRotate = true
//     renderer.render(scene, camera);
// }

// Handle window resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

const newTargetPosition = new THREE.Vector3(100, 100, 100);
cameraMover.moveTo(newTargetPosition);

camera.position.x=-10