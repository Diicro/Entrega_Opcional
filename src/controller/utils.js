import config from "../config.js";
export const sessionAuth=(req, res, next) => {
    if (!req.session.user)
  
        return res.status(401).send({ origin: config.SERVER, payload: 'Inicia sesion' });

    next();
  }

  export const roleAuth=(role)=>{return(req,res,next)=>{
    
    if(!(role===req.session.user.rol)){
    
        return res.status(403).send({origin:config.SERVER,payload:"No tienes autorización para este proceso"})
    }
    next()
  }}