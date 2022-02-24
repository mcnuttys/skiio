let camX = 0, camY = 0;

let canvasSize;
let worldScale = 10;
let cameraScale

let tileSize;

// Setup the cameras default values
const setup = (cSize, wScale) => {
    canvasSize = cSize;
    worldScale = wScale;
    cameraScale = cSize.width;
    tileSize = cameraScale / wScale;

    camX = 0;
    camY = 0;
}

// Method for converting a point in world space to screen space
const toScreenSpace = (posX, posY) => {
    let x = posX - camX;
    let y = posY - camY;

    x = (x / worldScale) * cameraScale;
    y = canvasSize.height - ((y / worldScale) * cameraScale);
    return { x, y };
}

// Sets the camera position to a point
const setPosition = (x, y) => {
    camX = x;
    camY = y;
}

// Lerp the camera towards a point at a given speed
const follow = (dt, followSpeed, posX, posY) => {
    camX += (posX - camX) * dt * followSpeed;
    camY += (posY - camY) * dt * followSpeed;
}

export { setup, toScreenSpace, setPosition, follow, tileSize, camX, camY };