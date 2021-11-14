const getSlopes = (req, res) => {
    return res.json({ slopes: [{ name: "Shawnee Peak", type: "Mountain", playerCount: 0 }] });
}

module.exports.getSlopes = getSlopes;