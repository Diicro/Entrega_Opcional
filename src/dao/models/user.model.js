import mongoose, { Schema } from "mongoose";

mongoose.pluralize(null);
 const userSchema=new Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    email:{type:String,required:true},
    passWord:{type:String},
    rol:{type:String,enum:["admin","user"],default:"user"},
    cart:{type:mongoose.Schema.Types.Object}
 })

 const users=mongoose.model("users",userSchema);

 export default users