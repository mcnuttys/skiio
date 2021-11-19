import * as camera from "./camera.js"
import * as input from "./inputManager.js"

class Player {
    constuctor(x, y, avatar) {
        this.x = x;
        this.y = y;

        this.avatar = avatar;

        this.movementSpeed = 1;
    }

    update(dt) {
        if (input.isKeyDown('w')) {
            this.y += this.movementSpeed * dt;
        }
        if (input.isKeyDown('a')) {
            this.x += -this.movementSpeed * dt;
        }
        if (input.isKeyDown('s')) {
            this.y += -this.movementSpeed * dt;
        }
        if (input.isKeyDown('d')) {
            this.x += this.movementSpeed * dt;
        }
    }

    draw(ctx) {
        const cPos = camera.toScreenSpace(this.x, this.y);
        ctx.drawImage(this.avatar, cPos.x, cPos.y, camera.tileSize, camera.tileSize);
    }
}

export { Player }