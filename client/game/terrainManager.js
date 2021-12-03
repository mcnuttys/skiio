import * as utils from "../helper/utils.js"
import * as camera from "./camera.js"
import * as game from "./game.js"

const CHUNK_SIZE = 16;

class TerrainManager {
    constructor(seed, terrainSpritesheet) {
        this.seed = seed;
        this.spritesheet = terrainSpritesheet;
        this.lastChunkPos = { x: -1, y: -1 }
        this.chunks = [];
    }

    update(dt, player) {
        let currentChunk = this.asChunk(camera.camX, camera.camY);

        if (currentChunk.x != this.lastChunkPos.x || currentChunk.y != this.lastChunkPos.y) {
            // Generate the chunks around the camera
            for (let x = -1; x < 2; x++) {
                for (let y = -1; y < 2; y++) {
                    let chunkX = currentChunk.x + x;
                    let chunkY = currentChunk.y + y;

                    if (!this.chunks.find(c => c.x == chunkX && c.y == chunkY)) {
                        this.chunks.push(new Chunk(chunkX, chunkY, 0, this.spritesheet))
                    }
                }
            }

            this.lastChunkPos.x = currentChunk.x;
            this.lastChunkPos.y = currentChunk.y;

            for (let i = 0; i < this.chunks.length; i++) {
                let chunk = this.chunks[i];
                if (utils.distance(chunk.x, chunk.y, camera.camX, camera.camY) > CHUNK_SIZE * 2) {
                    this.chunks.splice(i, 1);
                    i--;
                }
            }

            this.chunks.sort((a, b) => b.y - a.y);
        }

        if (!player) return;

        let playerChunkPos = this.asChunk(player.x, player.y);
        let playerChunk = this.chunks.find(c => c.x == playerChunkPos.x * 16 && c.y == playerChunkPos.y * 16);

        if (playerChunk) {
            playerChunk.tiles.forEach(tile => {
                if (tile.perlin < 0.65) return;

                if (utils.distance(tile.x, tile.y, player.x, player.y) < 2) {
                    // Kill the player
                    game.killLocalPlayer();
                }
            });
        }
    }

    asChunk(x, y) {
        return { x: Math.floor(x / CHUNK_SIZE), y: Math.floor(y / CHUNK_SIZE) }
    }

    draw(ctx) {
        for (let i = 0; i < this.chunks.length; i++) {
            let chunk = this.chunks[i];
            chunk.draw(ctx);
        }
    }
}

class Chunk {
    constructor(x, y, seed, terrainSpritesheet) {
        this.x = x * CHUNK_SIZE;
        this.y = y * CHUNK_SIZE;
        this.seed = seed;
        this.spritesheet = terrainSpritesheet;
        this.tiles = [];

        for (let i = 0; i < CHUNK_SIZE; i++) {
            for (let j = 0; j < CHUNK_SIZE; j++) {
                let index = j * CHUNK_SIZE + i;
                let tx = this.x + i;
                let ty = this.y + j;

                let tz = ty; //this.altitude(tx, ty);

                let facing = { x: -tx, y: -ty }

                // for (let x = -1; x < 2; x++) {
                //     for (let y = -1; y < 2; y++) {
                //         if (x != 0 && y != 0) {
                //             let alt = this.altitude(tx + x, ty + y);
                //             if (alt < tz) {
                //                 facing.x += -x;
                //                 facing.y += -y;
                //             }
                //             if (alt > tz) {
                //                 facing.x += x;
                //                 facing.y += y;
                //             }
                //         }
                //     }
                // }
                // facing.x /= 8;
                // facing.y /= 8;

                facing = utils.normalize(facing.x, facing.y);
                let perlin = noise.perlin2(tx / 10, ty / 10) + 0.5;
                // console.dir(`${perlin}, ${tx}, ${ty}`)

                this.tiles[index] = new Tile(tx, ty, tz, this.spritesheet, facing, perlin);
            }
        }

        this.tiles.sort((a, b) => b.y - a.y);
    }

    draw(ctx) {
        this.tiles.forEach(tile => {
            tile.draw(ctx);
        })
    }

    altitude(x, y) {
        return (utils.distance(x, y, 0, 0) / 5);
        // return noise.perlin2(x / 2, y / 2) * 2;
    }
}

class Tile {
    constructor(x, y, z, img, facing, perlin) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.img = img;
        this.facing = facing;
        this.perlin = perlin;

        // Slope direction...
        this.sx = 0;
        this.sy = 0;
    }

    draw(ctx) {
        const cPos = camera.toScreenSpace(this.x, this.y);

        if (utils.distance(this.x, this.y, camera.camX, camera.camY) > 15) return;

        ctx.save();

        const tile = { x: 16, y: 16 };
        if (this.facing.x > 0)
            tile.x -= 16;
        if (this.facing.x < 0)
            tile.x += 16;

        if (this.facing.y > 0)
            tile.y += 16;
        if (this.facing.y < 0)
            tile.y -= 16;

        // ctx.drawImage(this.img, tile.x, tile.y, 16, 16, cPos.x, cPos.y, camera.tileSize, camera.tileSize);

        if (this.perlin > 0.65) {
            // Tree
            ctx.drawImage(this.img, 48, 0, 16, 32, cPos.x, cPos.y, camera.tileSize, camera.tileSize * 2);
        }

        // ctx.fillStyle = "black";
        // ctx.font = "15px Arial"
        // ctx.fillText(Math.round(this.perlin * 100) / 100, cPos.x, cPos.y + 15);

        ctx.restore();
    }
}

export { TerrainManager }