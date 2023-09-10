const Product = require('../api/models/Product');

module.exports = (app) => {
    app.post("/api/products", async (req, res) => {
        const payload = req.body;
        const product = new Product(payload);
        try {
            await product.save();
            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    });
    app.get("/api/products", async (req, res) => {
        try {
            const product = await Product.find({});
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    });
    app.get("/api/products/:id", async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    });
    app.put("/api/products/:id", async (req, res) => {
        try {
            const payload = req.body;
            const product = await Product.findByIdAndUpdate(req.params.id, payload, {
                new: true,
            });
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    });
    app.delete("/api/products/:id", async (req, res) => {
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    });
};
