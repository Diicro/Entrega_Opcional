import productsModel from "../../dao/models/products.model.js"
import fs from "fs";
import path from "path";
import config from "../../config.js";
import CustomError from "../customError.js";
import { errorDicctionary } from "../errorsDictionary.js";


const upath = path.join(config.DIRNAME, "../src/dao/persistencia.local/products.json");

let productslocal = JSON.parse(fs.readFileSync(upath, "utf-8"));

class CollectionManager{
    constructor(){};

    getAll=async(filter,option)=>{
try{
    
    const productsPaginate= await productsModel.paginate(filter,option)
    return productsPaginate
    
}catch(error){
    req.logger.error("Error al acceder a la base datos")
    throw new CustomError(errorDicctionary.DATABASE_ERROR);}
}

    getId=async(pid)=>{
try{

    const productsById= await productsModel.findOne({id:pid}).lean()
    if (productsById.length<1){
        req.logger.warn("Id de producto no encontrado");
        throw new CustomError(errorDicctionary.ID_NOT_FOUND)}
    return productsById

}catch(error){
    req.logger.error("Error al acceder a la base datos")
    throw new CustomError(errorDicctionary.DATABASE_ERROR)}
}

    addProduct=async(product)=>{
try{
    fs.writeFileSync(upath, JSON.stringify(productslocal));
    const newproduct = await productsModel.create(product);
    productslocal.push(newproduct);

    return newproduct
}catch(error){
    req.logger.error("Error al acceder a la base datos")
    throw new CustomError(errorDicctionary.DATABASE_ERROR);}
    
    }
    
    update=async(filter,update,options,products,id)=>{
try{ 

    const updateProduct = await productsModel.findOneAndUpdate(
        filter,
        update,
        options
    );
    req.logger.info(updateProduct)
    products.splice(id, 1, updateProduct);
    fs.writeFileSync(upath, JSON.stringify(products));
    
    return updateProduct
}catch(error){ 
    req.logger.error("Error al acceder a la base datos")
    throw new CustomError(errorDicctionary.DATABASE_ERROR);}
    }
    delete=async(id,upgrateArray)=>{
try{
    productslocal = [...upgrateArray];

    fs.writeFileSync(upath, JSON.stringify(productslocal));
    const deleteProductDb = await productsModel.findOneAndDelete({ id: id });
    
    return deleteProductDb
    
}catch(error){ 
    req.logger.error("Error al acceder a la base datos")
    throw new CustomError(errorDicctionary.DATABASE_ERROR);}
    }
}
    export default CollectionManager;
