import { Router } from "express";
import { cartModos } from "../modos/cart.modos.js";

const routes = Router();

routes.get("/", cartModos.getProducts);
routes.get("/:cid", cartModos.productsCartById);
routes.post("/", cartModos.createCart);
routes.post("/:cid/product/:pid", cartModos.addProductToCart);
export default routes;
