const getMarket = (req, res) => {
    res.json({
        market: [
            { name: "Test Pack", path: "/assets/img/terrain/test" },
            { name: "Test Pack", path: "/assets/img/terrain/test" },
            { name: "Test Pack", path: "/assets/img/terrain/test" },
            { name: "Test Pack", path: "/assets/img/terrain/test" }
        ]
    });
}

module.exports.getMarket = getMarket;