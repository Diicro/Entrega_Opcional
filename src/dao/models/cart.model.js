import mongoose from "mongoose";



mongoose.pluralize(null);
const collection="carts";

 const cartSchema= new mongoose.Schema({
    id:{type: Number,required: true},
    products:[{ product: { type: mongoose.Schema.Types.Number, ref: 'products'}, quantity: Number }]

});

const model= mongoose.model(collection,cartSchema);

export default model;

