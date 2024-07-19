
import productsModel from "../../dao/models/products.model.js";
import CollectionManager from "./modos.manager.js";


class productDTO{
constructor(data,id){
  this.id=+id;
  this.title= data.title;
  this.description= data.description;
  this.price= +data.price;
  this.thubnail= data.thubnail || "[]"
  this.code= +data.code;
  this.stock= +data.stock;
  this.status= true;
  this.category=data.category
}
}

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
      
      const productNomalized= new productDTO(req.body,id+1)

      const completeSpace = Object.values(productNomalized).includes(undefined);
      const productseasy = [...products];
      const codeExiste = productseasy.some(
          (element) => element.code === productNomalized.code);
      
      if (completeSpace) {
              throw new Error("Todos los campos solicitados" );
      } else if (codeExiste) {
              throw new Error( "El codigo ya existe" );
      } else {

          const socketServer = req.app.get("socketServer")
          console.log(productNomalized)
          console.log(products)
          const addProduct=await manager.addProduct(productNomalized)

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
      
      const id = +req.body.id;
      const filter = { id: id };
      const update = req.body;
      const options = { new: true };
      
      const products = await productsModel.find({}).lean();
      
      const productNormalized= new productDTO(req.body,id)
      
  
      const sameCode = products.some((elemet) => productNormalized.code === elemet.code);
      if (sameCode) {
        throw new Error( "El codigo ya existe" );
      } else {

    const updates= await manager.update(filter,update,options,products,id)

    res.status(200).send(`Actualización de producto: ${updates.title} ha sido exitoso`)}
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

