import * as profile from "../app/profile.js"
import * as camera from "./camera.js"
import * as input from "./inputManager.js"
import * as helper from '../helper/helper.js'

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

let highScore = 0;
let score = 0;

let gameLoop;
let csrf;

const Canvas = (props) => {
    return (
        <canvas>Canvas needs to be supported!</canvas>
    )
}

const setup = (roomId, seed, _csrf) => {
    gameRunning = true;
    ReactDOM.render(<Canvas />, document.querySelector('#content'));
    csrf = _csrf;

    player = undefined;
    terrainManager = undefined;
    clearInterval(gameLoop);

    input.setup();
    noise.seed(seed);

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

    // socket.emit('spawn player', { room: localRoom, name: localUsername, avatar: localAvatar.path });

    networkPlayers = [];
    players.forEach(player => {
        if (player.name === localUsername) return;
        spawnNetworkPlayer(player.name, loadAvatar(player.avatar), player.x, player.y);
    });

    gameLoop = setInterval(loop, 1000 / 60);
})

let dt = 1 / 60;
let prevTime = 0;
const loop = () => {
    // if (prevTime !== timestamp) {
    //     dt = (timestamp - prevTime) / 1000;
    // }
    // prevTime = timestamp;

    // if (dt === "NaN" || dt > 0.1) {
    //     dt = 1 / 60;
    //     console.dir(dt);
    // }

    ctx.clearRect(0, 0, size.width, size.height);

    if (player && !player.dead) {
        camera.follow(dt, 15, player.x + (player.vx / 2.5) - 4.5, player.y + (player.vy / 2.5) - 5.5);
    }
    else if (networkPlayers.length > 0) {
        camera.follow(dt, 5, networkPlayers[0].x - 4.5, networkPlayers[0].y - 5.5);
    }

    terrainManager.update(dt, player);
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
                    angle: -player.angle,
                }
            );
        }
    }

    networkPlayers.forEach(netP => {
        netP.update(dt);
        netP.draw(ctx);
    });

    ctx.save();
    ctx.fillStyle = "black";
    ctx.strokeStyle = "white";
    ctx.font = "25px Arial";

    if (player && !player.dead) {
        // Draw Score Text
        if (Math.round(player.y) > score) {
            score = Math.round(player.y);
        }

        ctx.textAlign = "end";
        ctx.strokeText("Score: " + score, size.width, 25);
        ctx.fillText("Score: " + score, size.width, 25);

    } else {
        // Respawn stuff or spectating info
        ctx.textAlign = "center";

        ctx.strokeText("Score: " + score, size.width / 2, (size.height / 2) - 50);
        ctx.strokeText("High Score: " + highScore, size.width / 2, (size.height / 2) - 25);
        ctx.strokeText("Press Space to Respawn...", size.width / 2, size.height / 2);

        ctx.fillText("Score: " + score, size.width / 2, (size.height / 2) - 50);
        ctx.fillText("High Score: " + highScore, size.width / 2, (size.height / 2) - 25);
        ctx.fillText("Press Space to Respawn...", size.width / 2, size.height / 2);

        if (input.isKeyDown(' ')) {
            // Respawn the player
            socket.emit('spawn player', { room: localRoom, name: localUsername, avatar: localAvatar.path });
        }
    }

    ctx.restore();
}

socket.on('spawn player', (netPlayer) => {
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
    score = 0;
    player = p;
}

const killLocalPlayer = () => {
    if (score > highScore) {
        highScore = score;
        const data = { name: localUsername, type: "Alpine", score: score, _csrf: csrf };
        helper.sendPost("/leaderboard", data);
    }

    socket.emit('kill player', { room: localRoom });
    player.dead = true;
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

export { setup, closeGame, killLocalPlayer }