import { Router } from "express";
import userModel from "../dao/models/user.model.js"
import bcrypt from "bcrypt"
import passport from "passport";
import initAuthStrategy from "../auth/passport.strategies.js";

const routes=Router();
initAuthStrategy()

const sessionAuth= (req, res, next) => {
    if (!req.session.user)
  
        return res.status(401).send({ origin: config.SERVER, payload: 'Inicia sesion' });
  
    next();
  }

routes.post("/register",passport.authenticate("register"),async(req,res)=>{
    req.session.user=req.user
    try{
    if (req.user==="false"){res.status(400).send({error:"Email ya existe"})}
        
    await userModel.create(req.user);
    res.redirect("/views/login");
}catch(error){
    res.status(500).send(error.message)
}
})

routes.post("/pplogin",passport.authenticate("login"),async (req,res)=>{
    req.session.user=req.user
    try{
        
         if(req.user==="false"){
            res.status(404).send("Datos no validos")}
            else{
            req.session.save(async error=>{
                if (error){return res.status(500).send({payload:null,error:error.message})}
                const user=await userModel.findOne({email:req.session.user.email}).lean()
                console.log(user)
                res.redirect("/views/products")
                
            })
            
         }
        
        
    }catch(error){res.status(500).send(error.message)};
    

})
routes.get("/ghlogin",passport.authenticate("ghlogin",{scope:["user:email"]}),async(req,res)=>{})

routes.get("/ghlogincallback",passport.authenticate("ghlogin",{failureRedirect:"/login"}),
async(req,res)=>{
    try{
        req.session.user=req.user
        if(req.user==="false"){
            res.status(401).send({payload:"Faltan datos de usuario en GitHub"})
        }else{req.session.save(error=>{
            if(error){return res.status(500).send({payload:"Error",error:error.message})}
            else{res.redirect("/views/products")}
        })}

}catch(error){return done (error,false)}})
routes.get("/current",sessionAuth,async(req,res)=>{
    try{
        const user= await userModel.findOne({email:req.session.user.email})
        const userToObject=user.toObject()
        const userJson=JSON.stringify(userToObject)
        res.status(201).json({usuario:userJson})
    }catch(error){res.status(404).send({error:error.message,payload:"Tenemos problemas con tu usuario intenta mas tarde"})}
})
export default routes