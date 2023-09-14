const mongoose = require('../../services/mongoose.service').mongoose;

const { Schema } = mongoose;
const userSchema = new Schema({
    name: {
        type: String
      },
    password: {
        type: String
    },
    token: {
        type: String
    },
    email: {
        type: String
    },
}, { 
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model('Users', userSchema)