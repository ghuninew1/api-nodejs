const mongoose = require("mongoose");

const {
  Schema
} = mongoose;
const productSchema = new Schema({
  prod_name: String,
  prod_desc: String,
  prod_price: Number
}, {
  timestamps: true,
  versionKey: false
});
module.exports = mongoose.model('Product', productSchema);