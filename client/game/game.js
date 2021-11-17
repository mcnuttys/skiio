import * as profile from "../app/profile.js"

let canvas, ctx;

let size = { width: 600, height: 600 };

const Canvas = (props) => {
    return (
        <canvas>Canvas needs to be supported!</canvas>
    )
}

const setup = async () => {
    ReactDOM.render(<Canvas />, document.querySelector('#content'));

    // Load textures and stuff...
    // let avatar = await profile.getEquipedAvatar;
    // let terrainPack = await profile.getEquipedProfile;

    canvas = document.querySelector("canvas");
    canvas.width = size.width;
    canvas.height = size.height;

    ctx = canvas.getContext("2d");
    loop();
}

const loop = () => {
    requestAnimationFrame(loop);

    ctx.clearRect(0, 0, size.width, size.height);

    ctx.fill = "black";
    ctx.fillRect(0, 0, 100, 100);
}

export { setup }