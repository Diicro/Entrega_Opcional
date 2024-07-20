import mongoose from "mongoose";

const collection="tickets";

const schema=new mongoose.Schema({
    code:{type:String,unique:true},
    amount: {type: Number, required:true, default:0.0},
    purchaser:{type:String, required:true}
},
{
    timestamps:true
})

const ticket=mongoose.model(collection,schema)
export default ticket