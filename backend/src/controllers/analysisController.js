const Analysis = require("../models/Analysis");

exports.createAnalysis = async (req, res) => {
    try{
        const analysis = await Analysis.create(req.body);
        res.status(201).json(analysis);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};