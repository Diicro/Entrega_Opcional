import mongoose from "mongoose";

mongoose.pluralize(null);

const collection="message";

const schema=new mongoose.Schema({
    user:{type: String,required:true},
    message:{type: String,required:true}

})

const model = mongoose.model(collection, schema);
export default model