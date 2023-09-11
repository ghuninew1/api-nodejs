const mongoose = require("../../services/mongoose.service").mongoose;

const productSchema = new mongoose.Schema(
    {
        prod_name: String,
        prod_desc: String,
        prod_price: Number,
    },
    {
        timestamps: true,
        versionKey: false,
    }
);
module.exports = mongoose.model("Product", productSchema);
