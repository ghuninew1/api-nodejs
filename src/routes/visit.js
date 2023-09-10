const Visit = require("../api/models/Visit");

module.exports = (app) => {
    app.post("/api/visits", async (req, res) => {
        const payload = req.body;
        const visits = new Visit(payload);
        try {
            await visits.save();
            res.status(201).json(visits);
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    });
    app.get("/api/visits", async (req, res) => {
        try {
            const visitss = await Visit.find({});
            res.status(200).json(visitss);
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    });
    app.get("/api/visits/:id", async (req, res) => {
        try {
            const visits = await Visit.findById(req.params.id);
            res.status(200).json(visits);
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    });
    app.put("/api/visits/:id", async (req, res) => {
        try {
            const payload = req.body;
            const visits = await Visit.findByIdAndUpdate(req.params.id, payload, {
                new: true,
            });
            res.status(200).json(visits);
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    });
    app.delete("/api/visits/:id", async (req, res) => {
        try {
            const visits = await Visit.findByIdAndDelete(req.params.id);
            res.status(200).json(visits);
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    });
};
