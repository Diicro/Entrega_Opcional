import productsModel from "../../dao/models/products.model.js"
import fs from "fs";
import path from "path";
import config from "../../config.js";


const upath = path.join(config.DIRNAME, "../src/dao/persistencia.local/products.json");

let productslocal = JSON.parse(fs.readFileSync(upath, "utf-8"));

class CollectionManager{
    constructor(){};

    getAll=async(filter,option)=>{
try{
    
    const productsPaginate= await productsModel.paginate(filter,option)
    return productsPaginate
    
}catch(error){ return error.message}
}

    getId=async(pid)=>{
try{

    const productsById= await productsModel.findOne({id:pid}).lean()
    if (productsById.length<1){throw new Error("Producto no encontrado")}
    return productsById

}catch(error){throw new error("producto no encontrado")}
}

    addProduct=async(product)=>{
try{fs.writeFileSync(upath, JSON.stringify(productslocal));
      const newproduct = await productsModel.create(product);
      productslocal.push(newproduct);

      return newproduct
}catch(error){return error.message}
      
    }
    
    update=async(filter,update,options,products,id)=>{
try{ 

    const updateProduct = await productsModel.findOneAndUpdate(
        filter,
        update,
        options
    );
    console.log(`hola ${updateProduct}`)
    products.splice(id, 1, updateProduct);
    fs.writeFileSync(upath, JSON.stringify(products));
    
    return updateProduct
}catch(error){
            return error.message}
    }
    delete=async(id,upgrateArray)=>{
try{
            
      productslocal = [...upgrateArray];

      fs.writeFileSync(upath, JSON.stringify(productslocal));
      const deleteProductDb = await productsModel.findOneAndDelete({ id: id });
      
      return deleteProductDb
      
}catch(error){error.message}
    }
}
    export default CollectionManager;
