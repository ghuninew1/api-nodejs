const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const studentSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    rollno: {
        type: Number
    },
    },
    {
        timestamps: true, versionKey: false
    },
);
const StudentModel = mongoose.model('Student', studentSchema);

module.exports = StudentModel;