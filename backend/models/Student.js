const mongoose = require("mongoose");

const {
  Schema
} = mongoose;
const studentSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  rollno: {
    type: Number
  }
}, {
  timestamps: true,
  versionKey: false
});
module.exports = mongoose.model('Student', studentSchema);