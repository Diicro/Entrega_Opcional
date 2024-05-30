import fs from "fs";
import productsModel from "../dao/models/products.model.js";
import CollectionManager from "../dao/collectionManager.js";



const manager= new CollectionManager()

export const productsModos = {
  getProducts: async (req, res) =>{
    try{
    const limit = +req.query.limit ;
    const page = +req.query.page;
    const category= req.query.category;
    const sort = req.query.sort ? {price:+req.query.sort}:{};
    const products=await manager.getAll(limit,page,category,sort);

    res.status(200).send({products});}

    catch(error){
      res.status(500).send({error:error.message})
    }
  },

  getProductsById: async (req, res) => {
    
    
    try{const id = req.params.pid;
      const objectById = await manager.getId(id);
      res.status(200).send({ ...objectById });}
      catch(error){
        res.status(500).send({error:"producto no encontrado"});
      }
  },

  addProduct: async (req, res) => {
    try{
      const socketServer = req.app.get("socketServer")
      const addProduct=await manager.addProduct(req.body)

      res.status(200).send(`se agregó correctamente el producto ${addProduct}`)
      
      const products = await productsModel.find({}).lean();
      socketServer.emit("upGradeProducts", products)}
      
    catch(error){
      res.status(500).send(error.message)
  }

  },

  upDateProduct: async (req, res) => { 
    try{

    const update= await manager.update(req.params.pid,req.body)

    res.status(200).send(`Actualización: ${update}`)
  }catch(error)
  { res.status(500).send(error.message)}  
  },
  deleteProduct: async (req, res) => {try{
    const socketServer = req.app.get("socketServer");
    const deleteProduct= await manager.delete(req.params.pid)
    res.status(200).send(`Eliminado:${deleteProduct}`)
    
    const products = await productsModel.find({}).lean();
    socketServer.emit("upGradeProducts", products)
    }catch(error)
    {res.status(500).send(error.message)}
    
    }
  }

