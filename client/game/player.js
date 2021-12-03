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

        const facing = { x: Math.cos(this.angle + Math.PI / 2), y: Math.sin(this.angle + Math.PI / 2) };
        const downProj = utils.project(0, 10, facing.x, facing.y);

        if (input.isKeyDown('a')) {
            this.angle += 2 * dt;
        }

        if (input.isKeyDown('d')) {
            this.angle -= 2 * dt;
        }

        if (input.isKeyDown('s')) {
            this.addForce({ x: -this.vx * 0.5, y: -this.vy * 0.5 });
        }


        this.addForce({ x: downProj.x, y: downProj.y });
        this.addForce({ x: -this.vx * 0.075, y: -this.vy * 0.075 });

        let v = utils.magnitude(this.vx, this.vy);
        this.vx = facing.x * v;
        this.vy = facing.y * v;

        if(input.isKeyDown('w')) {
            if(v < 5) {
                this.vx += facing.x * 1;
                this.vy += facing.y * 1;
            }
        }

        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }

    addForce(f) {
        this.vx += f.x;
        this.vy += f.y;
    }

    draw(ctx) {
        const cPos = camera.toScreenSpace(this.x, this.y);

        ctx.save();
        ctx.translate(cPos.x + camera.tileSize / 2, cPos.y + camera.tileSize / 2)
        ctx.rotate(-this.angle);
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