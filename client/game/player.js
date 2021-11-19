import * as camera from "./camera.js"
import * as input from "./inputManager.js"

class Player {
    constructor(x, y, avatar) {
        this.x = x;
        this.y = y;

        this.avatar = avatar;

        this.movementSpeed = 1;
        this.vx = 0;
        this.vy = 0;
        this.facingX = 0;
        this.facingY = 0;
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
            this.facingX = this.vx;
            this.facingY = this.vy;
        }

        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }

    draw(ctx) {
        const cPos = camera.toScreenSpace(this.x, this.y);
        const angle = Math.atan2(this.facingX, this.facingY);

        ctx.save();
        ctx.translate(cPos.x + camera.tileSize / 2, cPos.y + camera.tileSize / 2)
        ctx.rotate(angle);
        ctx.translate(-(cPos.x + camera.tileSize / 2), -(cPos.y + camera.tileSize / 2))
        ctx.drawImage(this.avatar, cPos.x, cPos.y, camera.tileSize, camera.tileSize);
        ctx.restore();
    }
}

export { Player }