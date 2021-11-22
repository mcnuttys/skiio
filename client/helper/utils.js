const distance = (x0, y0, x1, y1) => {
    return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
}

const distance3 = (x0, y0, z0, x1, y1, z1) => {
    return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2) + Math.pow(z1 - z0, 2));
}

const magnitude = (x, y) => {
    return Math.sqrt(x * x + y * y);
}

const magnitude3 = (x, y, z) => {
    return Math.sqrt(x * x + y * y + z * z);
}

const normalize = (x, y) => {
    const mag = magnitude(x, y);
    return { x: x / mag, y: y / mag };
}

const normalize3 = (x, y, z) => {
    const magnitude = magnitude(x, y, z);
    return { x: x / magnitude, y: y / magnitude, z: z / magnitude };
}

export { distance, magnitude, normalize };