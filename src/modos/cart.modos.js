import fs, { cpSync } from "fs";
import path from "path";
import config from "../config.js";
import cartModel from "../dao/models/cart.model.js"
import productsModel from "../dao/models/products.model.js"

const upath = path.join(config.DIRNAME, "../src/dao/cart.json");
const upathProducts = path.join(config.DIRNAME, "../src/dao/products.json");
const carts = JSON.parse(fs.readFileSync(upath, "utf-8"));


export const cartModos = {
  getProducts: async(req, res) => {
    const cart= await cartModel.find().lean();
    res.status(200).send({...cart});
  },
  createCart: async(req, res) => {
    const carttoCreate= await cartModel.find().lean();
    const id = carttoCreate.length - 1;
    const cart = {
      id: id + 1,
      products: [],
    };
    carts.push(cart);
    fs.writeFileSync(upath, JSON.stringify(carts));
    const newCart= await cartModel.create(cart);
    res.status(200).send(`se creó el  carrito ${newCart}`);
  },
  addProductToCart: async(req, res) => {
    const id = +req.params.pid;
    const cid = +req.params.cid;
    let quantity;
    let productlocal ;
    let product;
    let outProductlocal;
    let outProductDb;
    const cart = carts.find((element) => element.id === cid);
    const cartDb= await cartModel.findOne({id:cid})
    if (cartDb) {
      productlocal = cart.products.find((element) => element.product === id);
      outProductlocal = cart.products.filter((element) => element.product !== id);
      product = cartDb.products.find((element) => element.product === id);
      outProductDb = cartDb.products.filter((element) => element.product !== id);

    }

    if (!cartDb) {
      res.status(400).send("No se encontro el carrito");
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
      const newProduct = [...outProductlocal, producInCart];
      const ola=await cartModel.findOneAndUpdate(filter,update,{ new: true })

      carts[cid].products = newProduct;
      fs.writeFileSync(upath, JSON.stringify(carts));
      res.status(200).send(`Se añadio ${ola}al carrito con exito`);
    }
  },
  productsCartById: async (req, res) => {
    const cid = +req.params.cid;
    const cartDb= await cartModel.findOne({id:cid});
    const products = [...cartDb.products];
    let newProducts = [];
    for (let index = 0; index < products.length; index++) {
      
      const arrayfor = await productsModel.findOne({id:products[index].product})
      newProducts.push(arrayfor);
    }
    if (cartDb) {
      console.log(cartDb.products)
      res.status(200).send(newProducts);
    } else {
      res.status(400).send("El carrito que buscas no existe");
    }
  },
  
};
