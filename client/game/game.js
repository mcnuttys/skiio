import * as profile from "../app/profile.js"
import * as camera from "./camera.js"
import * as input from "./inputManager.js"

import { Player, NetworkPlayer } from "./player.js"
import { TerrainManager } from "./terrainManager.js"

let canvas, ctx;

let size = { width: 600, height: 600 };

let avatarSprites = {};
let terrainSpritesheet;

let localAvatar;
let localUsername;
let localRoom;

let terrainManager;
let player;
let networkPlayers = [];

const socket = io();

let gameRunning = true;

const Canvas = (props) => {
    return (
        <canvas>Canvas needs to be supported!</canvas>
    )
}

const setup = async (roomId) => {
    gameRunning = true;
    ReactDOM.render(<Canvas />, document.querySelector('#content'));

    input.setup();
    noise.seed(Math.random());

    localRoom = roomId;
    socket.emit('join room', roomId);
}

socket.on('resume setup', async (players) => {
    // Load textures and stuff...
    let terrainPack = await profile.getEquipedTerrain();
    localAvatar = await profile.getEquipedAvatar();
    localUsername = await profile.getUsername();

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

    terrainManager = new TerrainManager(0, terrainSpritesheet);

    socket.emit('spawn player', { room: localRoom, name: localUsername, avatar: localAvatar.path });

    networkPlayers = [];
    players.forEach(player => {
        if (player.name === localUsername) return;
        spawnNetworkPlayer(player.name, loadAvatar(player.avatar), player.x, player.y);
    });

    loop();
})

let dt = 1 / 60;
const loop = () => {
    if (gameRunning) {
        requestAnimationFrame(loop);
    } else {
        return;
    }

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

    if (player) {
        camera.follow(dt, 15, player.x - 4.5, player.y - 5.5);
    }
    else if (networkPlayers.length > 0)
        camera.follow(dt, 15, networkPlayers[0].x - 4.5, networkPlayers[0].y - 5.5);
    else {
        camera.setPosition(0, 0);
    }

    terrainManager.update(dt);
    terrainManager.draw(ctx);

    if (player) {
        player.update(dt, socket);
        player.draw(ctx);

        if (player.sentX != player.x || player.sentY != player.y) {
            player.sentX = player.x;
            player.sentY = player.y;

            socket.emit(
                'move player',
                {
                    room: localRoom,
                    name: player.name,
                    x: player.sentX,
                    y: player.sentY,
                    angle: player.angle,
                }
            );
        }
    }

    networkPlayers.forEach(player => {
        player.update(dt);
        player.draw(ctx);
    });
}

socket.on('spawn player', (netPlayer) => {
    console.dir(netPlayer);
    if (netPlayer.name === localUsername) {
        spawnLocalPlayer(localUsername, loadAvatar(localAvatar.path));
    } else {
        spawnNetworkPlayer(netPlayer.name, loadAvatar(netPlayer.avatar));
    }
});

socket.on('remove player', (socketId) => {
    const i = networkPlayers.indexOf(networkPlayers.find(id => id.socketId === socketId));
    networkPlayers.splice(i, 1);
});

socket.on('move player', (move) => {
    const moved = networkPlayers.find(p => p.name === move.name);

    if (!moved) return;

    moved.setActual(move.x, move.y, move.angle);
});

const spawnLocalPlayer = (name, avatar) => {
    let p = new Player(name, 0, 0, avatar);

    player = p;
}

const spawnNetworkPlayer = (name, avatar, x = 0, y = 0) => {
    let np = new NetworkPlayer(name, avatar, x, y);

    networkPlayers.push(np);
}

const loadAvatar = (avatarPath) => {
    if (!avatarSprites[avatarPath]) {
        avatarSprites[avatarPath] = new Image();
        avatarSprites[avatarPath].src = `/assets/img/avatar${avatarPath}/sprite.png`;
    }

    return avatarSprites[avatarPath];
}

const closeGame = () => {
    networkPlayers = [];
    gameRunning = false;

    socket.emit('closed game');
}

export { setup, closeGame }