let camX = 0, camY = 0;

let canvasSize;
let worldScale = 10;
let cameraScale

let tileSize;

const setup = (cSize, wScale) => {
    canvasSize = cSize;
    worldScale = wScale;
    cameraScale = cSize.width;
    tileSize = cameraScale / wScale;
}

const toScreenSpace = (posX, posY) => {
    let x = posX - camX;
    let y = posY - camY;

    x = (x / worldScale) * cameraScale;
    y = canvasSize.height - ((y / worldScale) * cameraScale);
    return { x, y };
}

const setPosition = (x, y) => {
    camX = x;
    camY = y;
}

export { setup, toScreenSpace, setPosition, tileSize, camX, camY };