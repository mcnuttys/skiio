import * as camera from "./camera.js"
import * as input from "./inputManager.js"
import * as utils from "../helper/utils.js"

class Player {
    constructor(name, x, y, avatar) {
        this.name = name;
        this.x = x;
        this.y = y;

        this.avatar = avatar;

        this.movementSpeed = 1;
        this.vx = 0;
        this.vy = 0;
        this.angle = 0;
    }

    update(dt) {
        if (input.isKeyDown('w')) {
            this.vy += this.movementSpeed;
        }
        if (input.isKeyDown('a')) {
            this.vx += -this.movementSpeed;
        }
        if (input.isKeyDown('s')) {
            this.vy += -this.movementSpeed;
        }
        if (input.isKeyDown('d')) {
            this.vx += this.movementSpeed;
        }

        if (this.vx != 0) {
            this.vx -= this.vx * 0.3;
        }

        if (this.vy != 0) {
            this.vy -= this.vy * 0.3;
        }

        if (this.vx != 0 || this.vy != 0) {
            this.angle = Math.atan2(this.vx, this.vy);
        }

        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }

    draw(ctx) {
        const cPos = camera.toScreenSpace(this.x, this.y);

        ctx.save();
        ctx.translate(cPos.x + camera.tileSize / 2, cPos.y + camera.tileSize / 2)
        ctx.rotate(this.angle);
        ctx.translate(-(cPos.x + camera.tileSize / 2), -(cPos.y + camera.tileSize / 2))
        ctx.drawImage(this.avatar, cPos.x, cPos.y, camera.tileSize, camera.tileSize);
        ctx.restore();
    }
}

class NetworkPlayer {
    constructor(name, avatar, x = 0, y = 0, angle = 0) {
        this.name = name;
        this.avatar = avatar;

        this.x = x;
        this.y = y;
        this.angle = angle;
        this.actualX = x;
        this.actualY = y;
        this.actualAngle = angle;
        this.lerpSpeed = 10;
    }

    update(dt) {
        // this.x = this.x + (this.actualX - this.x) * dt * this.lerpSpeed;
        // this.y = this.y + (this.actualY - this.y) * dt * this.lerpSpeed;

        this.x = this.actualX;
        this.y = this.actualY;
        this.angle = this.actualAngle;
    }

    setActual(x, y, angle) {
        this.actualX = x;
        this.actualY = y;
        this.actualAngle = angle;
    }

    draw(ctx) {
        const cPos = camera.toScreenSpace(this.x, this.y);

        ctx.save();
        ctx.translate(cPos.x + camera.tileSize / 2, cPos.y + camera.tileSize / 2)
        ctx.rotate(this.angle);
        ctx.translate(-(cPos.x + camera.tileSize / 2), -(cPos.y + camera.tileSize / 2))
        ctx.drawImage(this.avatar, cPos.x, cPos.y, camera.tileSize, camera.tileSize);
        ctx.restore();
    }
}

export { Player, NetworkPlayer }