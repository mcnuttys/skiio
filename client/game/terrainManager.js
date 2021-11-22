import * as utils from "../helper/utils.js"
import * as camera from "./camera.js"

class TerrainManager {
    constructor(seed, terrainSpritesheet) {
        this.seed = seed;
        this.spritesheet = terrainSpritesheet;

        this.chunks = [
            new Chunk(0, 0, 0, terrainSpritesheet),
            new Chunk(-16, 0, 0, terrainSpritesheet),
            new Chunk(0, -16, 0, terrainSpritesheet),
            new Chunk(-16, -16, 0, terrainSpritesheet)
        ];
    }

    update(dt) {

    }

    draw(ctx) {
        this.chunks.forEach(chunk => {
            chunk.draw(ctx);
        })
    }
}

class Chunk {
    constructor(x, y, seed, terrainSpritesheet) {
        this.x = x;
        this.y = y;
        this.spritesheet = terrainSpritesheet;
        this.tiles = [];

        for (let i = 0; i < 16; i++) {
            for (let j = 0; j < 16; j++) {
                let index = j * 16 + i;
                let tx = this.x + i;
                let ty = this.y + j;

                let tz = this.altitude(tx, ty);

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

                this.tiles[index] = new Tile(tx, ty, tz, this.spritesheet, facing);
            }
        }
    }

    draw(ctx) {
        this.tiles.forEach(tile => {
            tile.draw(ctx);
        })
    }

    altitude(x, y) {
        return utils.distance(x, y, 0, 0)
    }
}

class Tile {
    constructor(x, y, z, img, facing) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.img = img;
        this.facing = facing;

        // Slope direction...
        this.sx = 0;
        this.sy = 0;
    }

    draw(ctx) {
        const cPos = camera.toScreenSpace(this.x, this.y);
        const cPos1 = camera.toScreenSpace(this.x + this.facing.x, this.y + this.facing.y);

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

        ctx.drawImage(this.img, tile.x, tile.y, 16, 16, cPos.x, cPos.y, camera.tileSize, camera.tileSize);

        // ctx.fillStyle = "black";
        // ctx.font = "15px Arial"
        // ctx.fillText(Math.round(this.z * 10) / 10, cPos.x, cPos.y + 15);

        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(cPos.x + camera.tileSize / 2, cPos.y + camera.tileSize / 2);
        ctx.lineTo(cPos1.x + camera.tileSize / 2, cPos1.y + camera.tileSize / 2);
        ctx.rect(cPos1.x + camera.tileSize / 2 - 7.5, cPos1.y + camera.tileSize / 2 - 7.5, 15, 15);
        ctx.closePath();
        ctx.stroke();

        ctx.restore();
    }
}

export { TerrainManager }