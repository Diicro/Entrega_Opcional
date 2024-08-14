import { Router } from "express";
import userModel from "../dao/models/user.model.js"
import CustomError from "../controller/customError.js";
import { errorDicctionary } from "../controller/errorsDictionary.js";
import { roleAuth } from "../controller/utils.js";

const routes=Router()

routes.post("/premium",roleAuth(["admin"]),async(req,res,next)=>{
const filter={email:req.body.uid}
const update={rol:req.body.rol}
const option={new:true}
    const user=await userModel.findOne(filter).lean()
        if(user && update.rol!=="admin"){
            const userUpdate=await userModel.findOneAndUpdate(filter,update,option)
        res.status(200).send({payload:"Se actualizo el rol del usuario satisfactoriamente"})
    }else{
        return next(new CustomError(errorDicctionary.RECORD_CREATION_ERROR))}
        
       
})

export default routes