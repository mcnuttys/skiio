const distance = (x0, y0, x1, y1) => {
    return Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
}

const magnitude = (x, y) => {
    return Math.sqrt(x * x + y * y);
}

const dot = (x0, y0, x1, y1) => {
    return (x0 * x1) + (y0 * y1);
}

// Angle between vectors
const angle = (x0, y0, x1, y1) => {
    return Math.acos(dot(x0, y0, x1, y1) / (magnitude(x0, y0) * magnitude(x1, y1)));
}

// Normalize vector
const normalize = (x, y) => {
    const mag = magnitude(x, y);
    return { x: x / mag, y: y / mag };
}

// Project x0, y0 onto x1, y1
const project = (x0, y0, x1, y1) => {
    const mag = magnitude(x0, y0);
    const scaler = magnitude(x0, y0) * Math.cos(angle(x0, y0, x1, y1));
    const unit = { x: x1 / mag, y: y1 / mag }
    return { x: scaler * unit.x, y: scaler * unit.y };

}

export { distance, magnitude, dot, angle, normalize, project };