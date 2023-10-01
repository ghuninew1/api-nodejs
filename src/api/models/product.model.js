const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        detail: {
            type: String
        },
        price: {
            type: Number
        },
        file: {
            type: String,
            default: 'noimage.jpg'
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("product", productSchema, "product");
