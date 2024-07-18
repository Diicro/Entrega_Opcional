import config from "../config.js";
export const sessionAuth=(h)=>{return(req, res, next) => {
    console.log(req.params.cid)
    console.log(h)
    if (!req.session.user)
  
        return res.status(401).send({ origin: config.SERVER, payload: 'Inicia sesion' });
    if( h ==="self" && req.session.user.cart.id===req.params.cid){
       next()
    }else{ return res.status(400).send({origin: config.SERVER, payload: 'Error al agregar el producto  a tu carrito'})}
    next();
  }}