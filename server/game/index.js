const getSlopes = (req, res) => {
    return res.json({ slopes: [{ name: "Shawny Peak", type: "Mountain", playerCount: 0 }] });
}

module.exports.getSlopes = getSlopes;