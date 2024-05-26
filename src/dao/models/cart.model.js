import mongoose from "mongoose";


mongoose.pluralize(null);
const collection="carts";
const productQuabtity= new mongoose.Schema({
   product:{type:Number},
   quantity:{type:Number}
});
 const schema= new mongoose.Schema({
    id:{type: Number,required: true},
    products:[productQuabtity]

});

const model= mongoose.model(collection,schema);

export default model;

