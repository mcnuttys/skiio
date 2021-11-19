const slopes = [];

const getSlopes = (req, res) => res.json({ slopes: slopes });

/*
test slope
{ name: "Shawnee Peak", type: "Mountain", playerCount: 0 }
*/

const createSlope = (req, res) => {
    if (!req.body.name || !req.body.type) {
        return res.status(400).json({ error: "Resort name, and type are required!" });
    }

    if (slopes.find(name => name.name === req.body.name)) {
        return res.status(400).json({ error: "Resort with that name already exists!" })
    }

    const resort = {
        name: req.body.name,
        type: req.body.type,
        playerCount: 0
    }

    slopes.push(resort);

    return res.status(200).json({ resort });
}

module.exports.getSlopes = getSlopes;
module.exports.createSlope = createSlope;
