const mongoose = require("../../services/mongoose.service").mongoose;

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
            default: 'image.jpg'
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);
module.exports = mongoose.model("Product", productSchema);
