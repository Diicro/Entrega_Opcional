import config from "../config.js";
import nodemailer from "nodemailer"
import { errorDicctionary } from "./errorsDictionary.js";
import CustomError from "./customError.js";
import jwt from "jsonwebtoken"

export const createToken=(payload,time)=>jwt.sign(payload,config.SECRET,{expiresIn:time})


export const verifyToken=(req,res,next)=>{
  const token=req.query.token

  if(!token) {
   res.redirect(`http://localhost:8080/views/tokeninvalid?error=Token no valido o caducado`)
  }else{
    jwt.verify(token,config.SECRET,(err,payload)=>{ 
  if(err){
    res.redirect(`http://localhost:8080/views/tokeninvalid?error=Token no valido o caducado`)
   

  }else{
    req.user=payload
    console.log(req.user)
      next()
      }    
    })}
   
  
  
}
export const sessionAuth=(req, res, next) => {
    if (!req.session.user){throw new CustomError(errorDicctionary.LOG_OUT)
     
    }else{next()}

    
  }

  export const roleAuth=(role)=>{return(req,res,next)=>{
    
    if(!(role.includes(req.session.user.rol))){
    
        return res.status(403).send({origin:config.SERVER,payload:"No tienes autorización para este proceso"})
    }else{
      return next()}
    
  }}
  export const transport=nodemailer.createTransport({
    service:"gmail",
    port:587,
    auth:{
      user:config.GMAIL_APP_USER,
      pass:config.GMAIL_APP_PASS
    }
  })