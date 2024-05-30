import productsModel from "./models/products.model.js"
import fs from "fs";
import path from "path";
import config from "../config.js";


const upath = path.join(config.DIRNAME, "../src/dao/products.json");

let productslocal = JSON.parse(fs.readFileSync(upath, "utf-8"));

class CollectionManager{
    constructor(){};

    getAll=async(limit,page,category,sort)=>{
try{
    const filter =category?{category:category}:{};
    const option={
        limit:limit||10,
        page:page||1,
        sort:sort }
    const productsPaginate= await productsModel.paginate(filter,option)
    return productsPaginate
    
}catch(error){ 
    
    return error.message}}

    getId=async(pid)=>{
        try{
       const productsById= await productsModel.findOne({id:pid}).lean()
       if (productsById.length<1){
        throw new Error("Producto no encontrado")
       }
       return productsById
       
    }catch(error){
        throw new error("producto no encontrado")
    }
}
    addProduct=async(body)=>{
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
      (element) => element.code === product.code
    );
    if (completeSpace) {

        throw new Error("Todos los campos solicitados" );
    } else if (codeExiste) {
      throw new Error( "El codigo ya existe" );
    } else {
      
      fs.writeFileSync(upath, JSON.stringify(productslocal));
      const newproduct = await productsModel.create(product);
      productslocal.push(newproduct);
      return newproduct}
    }
    update=async(params,body)=>{
        try{ 
        const id = +params;
        const filter = { id: id };
        const update = body;
        const options = { new: true };
        const product = {
          id: id,
          title: body.title,
          description: body.description,
          price: body.price,
          thumbnail: body.thumbnail || "[]",
          code: body.code,
          stock: body.stock,
          status: true,
          category: body.category,
        };
    
        const products = await productsModel.find({}).lean().sort(1);
    
    
        const sameCode = products.some((elemet) => product.code === elemet.code);
        if (sameCode) {
          throw new Error( "El codigo ya existe" );
          } else if (body.id) {
            if(body.id !== id)
                {throw new Error("No se puede cambiar el id")};
        } else {
            
            const updateProduct = await productsModel.findOneAndUpdate(
                filter,
                update,
                options
            );
            products.splice(id, 1, updateProduct);
            fs.writeFileSync(upath, JSON.stringify(products));
          return updateProduct}
        }catch(error){
            return error.message}
    }
    delete=async(params)=>{
        try{
            const getProducts = await productsModel.find({}).lean();

    const id = +params;
    const upgrateArray = getProducts.filter((element) => element.id !== id);

    if (getProducts.length === upgrateArray.length) {
      throw new Error("Producto no encontrado");
    } else {
      productslocal = [...upgrateArray];

      fs.writeFileSync(upath, JSON.stringify(productslocal));
      const deleteProductDb = await productsModel.findOneAndDelete({ id: id });
      

      return deleteProductDb
        }
        
    }catch(error){error.message}
    }
}
    export default CollectionManager;
