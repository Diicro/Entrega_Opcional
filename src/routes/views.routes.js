import { Router } from "express";
import config from "../config.js";
import fs from "fs";
import path from "path";
import productsModel from "../dao/models/products.model.js";


const routes = Router();



routes.get("/products", async (req, res) => {
  // const option={
  //   limit:3,
  //   page:+req.params.page||1,
  //   sort:{id:1}}
    
  // const products = await productsModel.paginate({},option)
  const products=await productsModel.find({}).sort({id:1}).limit(3).lean();
  const allProducts = { products: products};
  console.log(allProducts)
  res.render("home", allProducts );
});

routes.get("/realtimeproducts", async (req, res) => {
  const products = await productsModel.find().lean();

  const allProducts = { products: products };
  console.log(allProducts)
  res.render("realTimeProducts", allProducts);
});

routes.get("/chat", (req, res) => {
  res.render("chat", {});
});

export default routes;
