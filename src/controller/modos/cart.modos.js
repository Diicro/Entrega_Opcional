import fs from "fs";
import path from "path";
import nodemailer from "nodemailer"
import config from "../../config.js";
import cartModel from "../../dao/models/cart.model.js"
import productsModel from "../../dao/models/products.model.js"
import userModel  from "../../dao/models/user.model.js"
import ticketsModel from "../../dao/models/tickets.model.js"
import { errorDicctionary } from "../errorsDictionary.js";
import CustomError from "../customError.js";

const upath = path.join(config.DIRNAME, "../src/dao/persistencia.local/cart.json");
// const upathProducts = path.join(config.DIRNAME, "../src/dao/products.json");
const carts = JSON.parse(fs.readFileSync(upath, "utf-8"));

const transport=nodemailer.createTransport({
  service:"gmail",
  port:587,
  auth:{
    user:config.GMAIL_APP_USER,
    pass:config.GMAIL_APP_PASS
  }
})
export const cartModos = {
  getProducts: async(req, res) => {
    try{const cart= await cartModel.find().populate({path:'products.product',model:productsModel,select:'-_id',match:{id:{$exists:true}},foreignField:'id',localField:'products.product'}).lean();
    res.status(200).send({...cart});

  }catch(error){
      req.logger.error("Error al acceder a la base datos")
      throw new CustomError(errorDicctionary.DATABASE_ERROR);}
    
  },
  createCart: async(req, res) => {
    try{
      const carttoCreate= await cartModel.find().lean();
    const id = carttoCreate.length - 1;
    const cart = {
      id: id + 1,
      products: [],
    };
    // carts.push(cart);
    // fs.writeFileSync(upath, JSON.stringify(carts));
    const newCart= await cartModel.create(cart);
    return newCart

  }catch(error){ 
    req.logger.error("Error al acceder a la base datos")
    throw new CustomError(errorDicctionary.DATABASE_ERROR);}
    
  },
  addProductToCart: async(req, res) => {
    try{
    const id = +req.params.pid;
    const cid = +req.params.cid;
    let quantity;
    let product;
    let outProductDb;
    
    const cartDb= await cartModel.findOne({id:cid})
    if (cartDb) {

      product = cartDb.products.find((element) => element.product === id);
      outProductDb = cartDb.products.filter((element) => element.product !== id);

    }

    if (!cartDb) {
      req.logger.warn("Id no encontrado")
      throw new CustomError(errorDicctionary.ID_NOT_FOUND);
      
    } else if (product) {

      quantity = product.quantity;

      return addcart();
    } else {
      quantity = 0;

      return addcart();
    }
    async function  addcart () {
      const producInCart = {
        product: id,
        quantity: quantity + 1,
      };
      const filter={id:cid};
      const update={products:[...outProductDb, producInCart]}
      // const newProduct = [...outProductDb, producInCart];
      const ola=await cartModel.findOneAndUpdate(filter,update,{ new: true }).populate({path:'products.product',model:productsModel,select:'-_id',match:{id:{$exists:true}},foreignField:'id',localField:'products.product'}).lean()
      const {cart,...restUser}=req.session.user
      req.session.user={cart:ola,...restUser}
      
      req.session.save(async()=>{
        const cartUserUpdate= await userModel.findOneAndUpdate({email:req.session.user.email},{cart:ola},{new:true})
      
      })
      // carts[cid].products = newProduct;
      // fs.writeFileSync(upath, JSON.stringify(carts));
      res.status(200).send(`Se añadio ${ola}al carrito con exito`);
    }
    }catch(error){
      
      req.logger.error("Error al acceder a la base datos")
      throw new CustomError(errorDicctionary.DATABASE_ERROR);
     }
   
  },
  productsCartById: async (req, res) => {
    try{
    const cid = +req.params.cid;
    const cartDb= await cartModel.findOne({id:cid});
    const products = [...cartDb.products];
    let newProducts = [];
    for (let index = 0; index < products.length; index++) {
      
      const arrayfor = await productsModel.findOne({id:products[index].product})
      newProducts.push(arrayfor);
    }
    if (cartDb) {
      req.logger.debug(cartDb.products)
      res.status(200).send(newProducts);
    } else {
      req.logger.warn("Id del carro no encontrado")
      throw new CustomError(errorDicctionary.ID_NOT_FOUND);
    }
  }catch(error){
    req.logger.error("Error al acceder a la base datos")
    throw new CustomError(errorDicctionary.DATABASE_ERROR);}
    
  },
  deleteProducts:async(req,res)=>{
    try{
    const cid=+req.params.cid
    const clearArray={
      id:cid,
      products:[]
    }
    const newCart= await cartModel.findOneAndUpdate({id:cid},clearArray);
    carts[cid]=newCart

    res.status(200).send(`Lo productos del carrito ${cid} esta vacios`)

}catch(error){ 
  req.logger.error("Error al acceder a la base datos")
  throw new CustomError(errorDicctionary.DATABASE_ERROR);}
    
  },
  deleteProduct:async(req,res)=>{
    try{
    const cid =+req.params.cid
    const pid=+req.params.pid
    const cart=await cartModel.findOne({id:cid}).lean()
    const productdelete=[...cart.products]
    const deleteProduct=productdelete.filter((product)=> product.product !== pid);
    const newCart=await cartModel.findOneAndUpdate({id:cid},{products:deleteProduct},{new:true})
    carts[cid]=newCart
    fs.writeFileSync(upath,JSON.stringify(carts));

    res.status(200).send(`Se quito el producto ${newCart} del carrito ${cid}`)
  
  }catch(error){
    req.logger.error("Error al acceder a la base datos")
    throw new CustomError(errorDicctionary.DATABASE_ERROR);}
    
  },
  addQuantity:async(req,res)=>{
    try{
    const cid =+req.params.cid
    const pid=+req.params.pid
    const qty=+req.params.qty
    const cart=await cartModel.findOne({id:cid}).lean()
    if(cart){
    const productadd=[...cart.products]
    const addToProduct=productadd.filter((element)=>element.product === pid)
    const deleteProduct=productadd.filter((product)=> product.product !== pid);
       if(addToProduct){
         const product={
         product:pid,
         quantity:addToProduct[0].quantity + qty
        }
    const newproduct=[...deleteProduct,product]
        const newQuantity=await cartModel.findOneAndUpdate({id:cid},{products:newproduct},{new:true})
        carts[cid]=newQuantity
        fs.writeFileSync(upath,JSON.stringify(carts));

          res.status(200).send(`Cantidad del producto ${pid} actualizada`)
        
        }else{
          req.logger.warn("Id de producto no encontrado")
          throw new CustomError(errorDicctionary.ID_NOT_FOUND)}
    }else{
      req.logger.warn("Id de carrito no encontrado")
      throw new  CustomError(errorDicctionary.ID_NOT_FOUND)}
    
}catch(error){ 
  req.logger.error("Error al acceder a la base datos")
  throw new CustomError(errorDicctionary.DATABASE_ERROR);}
    
  },
  addTicket:async(req,res)=>{
    try{ 
      let priceTotal=0

      const cart=req.session.user.cart
      for (const element of cart.products) {
        let excesiveQuantity;
        const productsDb = await productsModel.findOne({ id: element.product.id });

        if (element.quantity > productsDb.stock) {
            excesiveQuantity = +(element.quantity - productsDb.stock);

            await productsModel.findOneAndUpdate({ id: element.product.id }, { stock: 0 }, { new: true });

            const cartUser = await cartModel.findOne({ id: req.params.cid });
            const cartFilter = cartUser.products.filter(elem => elem.product !== element.product.id);
            const update = { products: [...cartFilter, { product: element.product.id, quantity: excesiveQuantity }] };
            const cartUpdate = await cartModel.findOneAndUpdate({ id: req.params.cid }, update, { new: true }).populate({ path: 'products.product', model: productsModel, select: '-_id', match: { id: { $exists: true } }, foreignField: 'id', localField: 'products.product' }).lean();

            const { cart, ...resUser } = req.session.user;
            req.session.user = { cart:cartUpdate, ...resUser };
            await req.session.save();
            await userModel.findOneAndUpdate({ email: req.session.user.email },{ cart: cartUpdate }, { new: true });
        }else {
            excesiveQuantity = false;

            await productsModel.findOneAndUpdate({id: element.product.id }, { stock: productsDb.stock - element.quantity }, { new: true });

            const cartUser = await cartModel.findOne({ id: req.params.cid }).lean();
            const cartFilter = cartUser.products.filter(elem => elem.product !== element.product.id);
            const cartUpdate = await cartModel.findOneAndUpdate({ id: req.params.cid }, { products: cartFilter }, { new: true }).populate({ path: 'products.product', model: productsModel, select: '-_id', match: { id: { $exists: true } }, foreignField: 'id', localField: 'products.product' }).lean();

            const {cart, ...resUser } = req.session.user;
            req.session.user = { cart: cartUpdate, ...resUser };
            await req.session.save();
            await userModel.findOneAndUpdate({ email: req.session.user.email }, { cart: cartUpdate }, { new: true });
        }

        const priceProduct = (excesiveQuantity === false) ? (element.quantity * element.product.price) : ((element.quantity - excesiveQuantity) * element.product.price);

        priceTotal = priceTotal + priceProduct;
    }
      
      const ticket={
        code: Math.floor(Math.random()*1000000),
        amount:priceTotal,
        purchaser:req.session.user.email
      }

     const createTicket=await ticketsModel.create(ticket);
    
        const mailConfirmation=await transport.sendMail({
          from:`FachaPets <${config.GMAIL_APP_USER}>`,
          to:ticket.purchaser,
          subject:"comprobante compra.",
          html:`<h1>Codigo de ticket:# ${ticket.code}<h1><br/><h1>Precio de la compra:$${ticket.amount}</h1>`
        })
        

      res.status(200).send({data:`Email enviado `})


    }catch(error){ 
      req.logger.error("Error al acceder a la base datos")
      throw new CustomError(errorDicctionary.DATABASE_ERROR)}
  }
};
