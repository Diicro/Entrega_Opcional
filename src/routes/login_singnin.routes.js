import { Router } from "express";
import userModel from "../dao/models/user.model.js"


const routes=Router();

routes.post("/register",async(req,res)=>{
    const {firstName,lastName,email,passWord}=req.body
    try{
    const userConfirm= await userModel.findOne({email:email}).lean();
    if(userConfirm){
            res.status(401).send("Email ya registrado");
            
    }
    const user={
        firstName:firstName,
        lastName:lastName,
        email:email,
        passWord:passWord
    }
    await userModel.create(user);
    res.redirect("/views/login");
}catch(error){
    res.status(500).send(error.message)
}
})

routes.post("/login",async (req,res)=>{
    const {email,passWord}=req.body
    try{
        const findUser=await userModel.findOne({email:email})
         if(!findUser){
            res.status(404).send("Usuario no registrado");
         }else if (findUser.passWord !== passWord){
            res.status(401).send("La clave o el usuario no son correctos");
         }else{
            req.session.user={firstName:findUser.firstName,lastName:findUser.lastName,rol:findUser.rol}
            res.redirect("/views/products")
         }
        
        
    }catch(error){res.status(500).send(error.message)};
    

})
export default routes