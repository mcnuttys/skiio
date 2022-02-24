const keys = {};

const setup = () => {
    document.onkeydown = keyDown;
    document.onkeyup = keyUp
}

const keyDown = (e) => {
    keys[e.key] = true;
}

const keyUp = (e) => {
    keys[e.key] = false;
}

const isKeyDown = (key) => keys[key];
const isKeyUp = (key) => keys[key];

export { setup, isKeyDown, isKeyUp }