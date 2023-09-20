const mongoose = require("../../services/mongoose.service").mongoose;

const schemaOptions = {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: false
};
const visitSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },
        counter: {
            type: Number,
            required: true,
        },
    },
    schemaOptions);
const visits = mongoose.model("visits", visitSchema, "visits");

module.exports = visits;
