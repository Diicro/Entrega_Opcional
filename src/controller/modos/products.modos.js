import fs from "fs";
import productsModel from "../../dao/models/products.model.js";
import CollectionManager from "./modos.manager.js";
import { paginate } from "mongoose-paginate-v2";



const manager= new CollectionManager()

export const productsModos = {
  getProducts: async (req, res) =>{
    try{
    const limit = +req.query.limit ;
    const page = +req.query.page;
    const category= req.query.category;
    const sort = req.query.sort ? {price:+req.query.sort}:{};

    const filter =category?{category:category}:{};
    const option={
        limit:limit||3,
        page:page||1,
        sort:sort }
    const products=await manager.getAll(filter,option);

    res.status(200).send({products});}

    catch(error){
      res.status(500).send({error:error.message})
    }
  },

  getProductsById: async (req, res) => {
    try{
      const id = req.params.pid;
      const objectById = await manager.getId(id);
      res.status(200).send({ ...objectById });
    }catch(error){res.status(500).send({error:"producto no encontrado"})}
  },

  addProduct: async (req, res) => {
    try{
      let id;
      
      const products = await productsModel.find({}).lean();
      products.length < 1 ? (id = -1) : (id = products.length - 1);
      
      const product = {
        id: id + 1,
        title: body.title,
        description: body.description,
        price: body.price,
        thumbnail: body.thumbnail ||"[]",
        code: body.code,
        stock: body.stock,
        status: true,
        category: body.category
      };
      const completeSpace = Object.values(product).includes(undefined);
      const productseasy = [...products];
      const codeExiste = productseasy.some(
          (element) => element.code === product.code);
      
      if (completeSpace) {
              throw new Error("Todos los campos solicitados" );
      } else if (codeExiste) {
              throw new Error( "El codigo ya existe" );
      } else {

          const socketServer = req.app.get("socketServer")
          const addProduct=await manager.addProduct(product)

      res.status(200).send(`se agregó correctamente el producto ${addProduct}`)
      
      const productos = await productsModel.find({}).lean();
      socketServer.emit("upGradeProducts", productos)}
      
      }
      
    catch(error){
      res.status(500).send(error.message)
  }

  },

  upDateProduct: async (req, res) => { 
    try{
      
      const id = +req.params.pid;
      const filter = { id: id };
      const update = req.body;
      const options = { new: true };
      const product = {
        id: +id,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        thumbnail: req.body.thumbnail || "[]",
        code: req.body.code,
        stock: req.body.stock,
        status: true,
        category: req.body.category,
      };
  
      const products = await productsModel.find({}).lean().sort(1);
  
  
      const sameCode = products.some((elemet) => product.code === elemet.code);
      if (sameCode) {
        throw new Error( "El codigo ya existe" );
        } else if (body.id) {
          if(body.id !== id)
              {throw new Error("No se puede cambiar el id")};
      } else {

    const updates= await manager.update(filter,update,options,products)

    res.status(200).send(`Actualización: ${updates}`)}
  }catch(error)
  { res.status(500).send(error.message)}  
  },
  deleteProduct: async (req, res) => {
    try{
    const getProducts = await productsModel.find({}).lean();

    const id = +req.params.pid;
    const upgrateArray = getProducts.filter((element) => element.id !== id);

    if (getProducts.length === upgrateArray.length) {
      throw new Error("Producto no encontrado");
    } else {

    const socketServer = req.app.get("socketServer");
    const deleteProduct= await manager.delete(id,upgrateArray)
    res.status(200).send(`Eliminado:${deleteProduct}`)
    
    const products = await productsModel.find({}).lean();
    socketServer.emit("upGradeProducts", products)}
    }catch(error)
    {res.status(500).send(error.message)}
    
    }
  }

