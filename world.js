// // // anotherFile.js

// // export default class World {
// //     constructor(seed) {

// //         this.world=[]


// //     }

// //     greet() {
// //         console.log(`Hello, ${this.name}!`);
// //     }


// // }


// export default class World {
//     constructor(seed) {
//         this.seed = seed; // Store the seed for procedural generation
//         this.chunks = new Map(); // Stores chunks with their coordinates as keys
//         this.chunkSize = 16; // Each chunk is 16x16x16 blocks

//         // Initialize your noise generator or any other procedural generation tool with the seed
//         this.noiseGenerator = this.initializeNoiseGenerator(seed);
//     }

//     // Initialize the noise generator with the seed (e.g., using Simplex or Perlin noise)
//     initializeNoiseGenerator(seed) {
//         return new SimplexNoise(() => this.seededRandom(seed));
//     }

//     // A simple seeded random number generator function (you could use a library for better RNG)
//     seededRandom(seed) {
//         let x = Math.sin(seed++) * 10000;
//         return x - Math.floor(x);
//     }

//     // Method to generate a chunk at (chunkX, chunkY, chunkZ)
//     generateChunk(chunkX, chunkY, chunkZ) {
//         const chunk = new Array(this.chunkSize)
//             .fill(null)
//             .map(() => new Array(this.chunkSize)
//                 .fill(null)
//                 .map(() => new Array(this.chunkSize)
//                     .fill(null)));

//         // Use the noise generator to fill in the chunk based on its position and seed
//         for (let x = 0; x < this.chunkSize; x++) {
//             for (let y = 0; y < this.chunkSize; y++) {
//                 for (let z = 0; z < this.chunkSize; z++) {
//                     // Example: generate terrain based on noise (this is just a basic example)
//                     const worldX = chunkX * this.chunkSize + x;
//                     const worldY = chunkY * this.chunkSize + y;
//                     const worldZ = chunkZ * this.chunkSize + z;

//                     const noiseValue = this.noiseGenerator.noise3D(worldX / 100, worldY / 100, worldZ / 100);

//                     // Set block type based on noise value (e.g., air, stone, dirt)
//                     if (noiseValue > 0.5) {
//                         chunk[x][y][z] = 'stone';
//                     } else if (noiseValue > 0) {
//                         chunk[x][y][z] = 'dirt';
//                     } else {
//                         chunk[x][y][z] = 'air';
//                     }
//                 }
//             }
//         }

//         return chunk;
//     }

//     // Method to get a chunk at specific (chunkX, chunkY, chunkZ)
//     getChunk(chunkX, chunkY, chunkZ) {
//         const key = `${chunkX},${chunkY},${chunkZ}`;
//         if (!this.chunks.has(key)) {
//             this.chunks.set(key, this.generateChunk(chunkX, chunkY, chunkZ));
//         }
//         return this.chunks.get(key);
//     }

//     // Method to get a block at global coordinates (x, y, z)
//     getBlock(x, y, z) {
//         const chunkX = Math.floor(x / this.chunkSize);
//         const chunkY = Math.floor(y / this.chunkSize);
//         const chunkZ = Math.floor(z / this.chunkSize);

//         const localX = x % this.chunkSize;
//         const localY = y % this.chunkSize;
//         const localZ = z % this.chunkSize;

//         const chunk = this.getChunk(chunkX, chunkY, chunkZ);
//         return chunk[localX][localY][localZ];
//     }

//     // Method to set a block at global coordinates (x, y, z)
//     setBlock(x, y, z, block) {
//         const chunkX = Math.floor(x / this.chunkSize);
//         const chunkY = Math.floor(y / this.chunkSize);
//         const chunkZ = Math.floor(z / this.chunkSize);

//         const localX = x % this.chunkSize;
//         const localY = y % this.chunkSize;
//         const localZ = z % this.chunkSize;

//         const chunk = this.getChunk(chunkX, chunkY, chunkZ);
//         chunk[localX][localY][localZ] = block;
//     }
// }

const simplex = new SimplexNoise();

export default class World{
    constructor(seed){
        this.seed=seed
        this.terrain=false
        this.visibleTerrain=false
        this.width=0
        this.height=0
        this.depth=0
    }

    generate3DTerrain(width, height, depth, scale = 100.0, maxHeight = 10.0) {
        this.width=width
        this.height=height
        this.depth=depth
        const terrain = [];
    
        for (let y = 0; y < height; y++) {
            const row = [];
    
            for (let x = 0; x < width; x++) {
                const vertical=[]

                let heightValue = 0;
    
                for (let z = 0; z < depth; z++) {
                    // Generate noise value for (x, y, z) coordinate
                    let noiseValue = simplex.noise3D(x / scale, y / scale, z / scale);
    
                    // Accumulate height value
                    heightValue += (noiseValue + 1) / 2 * maxHeight; // Normalize and scale
    
                    // Optional: Introduce a break to stop adding height after reaching a certain threshold
                    if (heightValue > maxHeight) break;
                }
                for(let h=0;h<height;h++){
                    if(heightValue>0){
                        vertical.push(1)
                    }
                    else{
                        vertical.push(0)
                    }
                    heightValue-=1

                }
                row.push(vertical)
                

                // row.push(Math.floor(heightValue));
            }
    
            terrain.push(row);
        }
    
        // return terrain;
        console.log(terrain)
        this.terrain=terrain


    }


    visibleTerrain(){
        for(let i=0;i<this.height;i++){
            for(let j=0;j<this.width;j++){
                for(let k=0;k<this.depth;k++){
                    // if()
                    return
                }
            }
        }
    }


}