const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const datatestSchema = new Schema({
    name: {
        type: String
    },
    alt: {
        type: String
    },
    image: {
        type: String
    },
    },
    {
        timestamps: true, versionKey: false,
    },
);
const DatatestModel = mongoose.model('Datatest', datatestSchema);

module.exports = DatatestModel;