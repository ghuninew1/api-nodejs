const mongoose = require('../../common/services/mongoose.service').mongoose;

const { Schema } = mongoose;
const datatestSchema = new Schema({
  name: {
    type: String
  },
  alt: {
    type: String
  },
  image: {
    type: String
  }
}, {
  timestamps: true,
  versionKey: false
});
module.exports = mongoose.model('Datatest', datatestSchema);