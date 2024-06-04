import mongoose, { Schema } from "mongoose";

mongoose.pluralize(null);
 const userSchema=new Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    email:{type:String,required:true},
    passWord:{type:String,required:true},
    rol:{type:String,enum:["admin","user"],default:"user"} 
 })

 const users=mongoose.model("users",userSchema);

 export default users