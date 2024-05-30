import mongoose from "mongoose";
import mogoosePaginate from "mongoose-paginate-v2";

mongoose.pluralize(null);

const collection = "products";
const schema = new mongoose.Schema({
  id: { type: Number, required: true,index: true},
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: false },
  code: { type: Number, required: true,index: true},
  stock: { type: Number, required: true },
  status: { type: String, default: true },
  category: { type: String, required: true },
});

schema.plugin(mogoosePaginate)

const model = mongoose.model(collection, schema);
export default model;
