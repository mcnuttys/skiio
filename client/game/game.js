import * as profile from "../app/profile.js"
import * as camera from "./camera.js"
import * as input from "./inputManager.js"

import Player from "./player.js"

let canvas, ctx;

let size = { width: 600, height: 600 };

let avatarSprites = {};
let terrainSpritesheet;

let player;

const Canvas = (props) => {
    return (
        <canvas>Canvas needs to be supported!</canvas>
    )
}

const setup = async () => {
    ReactDOM.render(<Canvas />, document.querySelector('#content'));

    input.setup();

    // Load textures and stuff...
    let avatar = await profile.getEquipedAvatar();
    let terrainPack = await profile.getEquipedTerrain();

    avatarSprites[avatar._id] = new Image();
    avatarSprites[avatar._id].src = `/assets/img/terrain${avatar.path}/sprite.png`;

    terrainSpritesheet = new Image();
    terrainSpritesheet.src = `/assets/img/terrain${terrainPack.path}/spritesheet.png`;

    canvas = document.querySelector("canvas");
    canvas.width = size.width;
    canvas.height = size.height;

    camera.setup(size, 10);

    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;

    

    loop();
}

let dt = 0;
const loop = () => {
    requestAnimationFrame(loop);

    ctx.clearRect(0, 0, size.width, size.height);

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            ctx.save();
            ctx.translate(0, -camera.tileSize);
            ctx.fillStyle = `rgb(${(i / 10) * 255}, ${(j / 10) * 255}, ${(((i / 10) + (j / 10)) / 2) * 255})`;
            const pos = camera.toScreenSpace(i, j);
            ctx.fillRect(pos.x, pos.y, camera.tileSize, camera.tileSize);
            ctx.restore();
        }
    }

    ctx.drawImage(terrainSpritesheet, 16, 16, 16, 16, 0, 0, camera.tileSize, camera.tileSize);

    // camera.setPosition({ x: Math.cos(dt), y: Math.sin(dt) });

    let px = 0, py = 0;
    if (input.isKeyDown("w"))
        py += 1 * (1 / 60);
    if (input.isKeyDown("s"))
        py += -1 * (1 / 60);

    if (input.isKeyDown("d"))
        px += 1 * (1 / 60);
    if (input.isKeyDown("a"))
        px += -1 * (1 / 60);

    camera.setPosition(camera.camX + px, camera.camY + py);

    ctx.save();

    let center = camera.toScreenSpace(0, 0);
    let cPos = camera.toScreenSpace(camera.camX, camera.camY);

    ctx.strokeStyle = "black";
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(center.x, center.y, camera.tileSize / 8, 0, Math.PI * 2);
    ctx.moveTo(center.x, center.y)
    ctx.lineTo(cPos.x, cPos.y)
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore();
    dt += 1 / 60;
}

export { setup }