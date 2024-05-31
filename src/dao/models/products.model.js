import mongoose from "mongoose";
import mogoosePaginate from "mongoose-paginate-v2";

mongoose.pluralize(null);


const productSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.Number, required: true},
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: false },
  code: { type: Number, required: true,index: true},
  stock: { type: Number, required: true },
  status: { type: Boolean, default: true },
  category: { type: String, required: true },
},);

productSchema.plugin(mogoosePaginate)

const product = mongoose.model('products', productSchema);
export default product;
