class Missile {
    constructor(position = { x: 0, y: 0, z: 0 }, color = 0xff0000) {
        this.mesh = this.createMissileMesh(color);
        this.mesh.position.set(position.x, position.y, position.z);
        this.direction = new THREE.Vector3(0, 0, 1); // Default direction pointing along the z-axis
        this.updateMeshRotation();
    }

    createMissileMesh(color) {
        const missileGroup = new THREE.Group(); // Group to hold all parts of the missile

        // Create the missile body (cylinder)
        const bodyGeometry = new THREE.CylinderGeometry(1, 1, 10, 32); // Radius top, radius bottom, height, segments
        const bodyMaterial = new THREE.MeshBasicMaterial({ color: color });
        const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
        bodyMesh.rotation.x = Math.PI / 2; // Rotate so it's pointing along the z-axis
        missileGroup.add(bodyMesh);

        // Create the missile nose (cone)
        const noseGeometry = new THREE.ConeGeometry(1.5, 4, 32); // Radius, height, segments
        const noseMaterial = new THREE.MeshBasicMaterial({ color: color });
        const noseMesh = new THREE.Mesh(noseGeometry, noseMaterial);
        noseMesh.position.set(0, 0, 7); // Position it at the front of the body
        missileGroup.add(noseMesh);

        // Create the missile fins (box or plane)
        const finGeometry = new THREE.BoxGeometry(0.5, 2, 5); // Width, height, depth
        const finMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 }); // Black fins
        const fin1 = new THREE.Mesh(finGeometry, finMaterial);
        const fin2 = fin1.clone();
        const fin3 = fin1.clone();
        const fin4 = fin1.clone();

        // Position fins around the missile body
        fin1.position.set(1, 0, -4);
        fin2.position.set(-1, 0, -4);
        fin2.rotation.y = Math.PI / 2;
        fin3.position.set(0, 1, -4);
        fin3.rotation.z = Math.PI / 2;
        fin4.position.set(0, -1, -4);
        fin4.rotation.z = Math.PI / 2;

        missileGroup.add(fin1, fin2, fin3, fin4);

        return missileGroup;
    }

    // Set the direction of the missile
    setDirection(direction) {
        this.direction.copy(direction).normalize(); // Ensure direction is normalized
        this.updateMeshRotation();
    }

    // Get the current direction of the missile
    getDirection() {
        return this.direction.clone();
    }

    // Update the missile's mesh rotation to match its direction
    updateMeshRotation() {
        const up = new THREE.Vector3(0, 1, 0); // World up vector
        const rotationMatrix = new THREE.Matrix4();
        rotationMatrix.lookAt(new THREE.Vector3(), this.direction, up);
        this.mesh.rotation.setFromRotationMatrix(rotationMatrix);
    }

    // Method to update the missile's position
    setPosition(x, y, z) {
        this.mesh.position.set(x, y, z);
    }

    // Method to update the missile's rotation
    setRotation(x, y, z) {
        this.mesh.rotation.set(x, y, z);
    }

    // Method to add missile to the scene
    addToScene(scene) {
        scene.add(this.mesh);
    }

    // Method to remove missile from the scene
    removeFromScene(scene) {
        scene.remove(this.mesh);
    }
}
