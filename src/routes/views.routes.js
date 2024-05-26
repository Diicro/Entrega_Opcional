import { Router } from "express";
import config from "../config.js";
import fs from "fs";
import path from "path";
import productsModel from "../dao/models/products.model.js";

const routes = Router();
// const productslocal = JSON.parse(
//   fs.readFileSync(
//     path.join(config.DIRNAME, "../src/jsons/products.json"),
//     "utf-8"
//   )
// );

routes.get("/", async (req, res) => {
  const products = await productsModel.find().lean();
  const allProducts = { products: products };
  res.render("home", allProducts);
});

routes.get("/realtimeproducts", async (req, res) => {
  const products = await productsModel.find().lean();

  const allProducts = { products: products };
  res.render("realTimeProducts", allProducts);
});

routes.get("/chat", (req, res) => {
  res.render("chat", {});
});

export default routes;
