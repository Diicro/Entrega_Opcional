import { Router } from "express";
import config from "../config.js";
import productsModel from "../dao/models/products.model.js";


const routes = Router();

const sessionAuth= (req, res, next) => {
  if (!req.session.user)

      return res.status(401).send({ origin: config.SERVER, payload: 'Inicia sesion' });

  next();
}

routes.get("/products",sessionAuth, async (req, res) => {
  const option={
    limit:3,
    page:+req.query.page||1,
    sort:{id:1},
    lean:true,
  leanWithId:false}
    
  const products = await productsModel.paginate({},option)
  const productsandUser= {...products,...req.session.user}
  const allProducts = { products: productsandUser};
  console.log(req.session.user.cart.products)

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

routes.get("/register", (req, res) => {
  res.render("register", {});
});
routes.get("/login", (req, res) => {
  res.render("login", {});
});

export default routes;
