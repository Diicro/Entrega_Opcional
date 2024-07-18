import { Router } from "express";
import { cartModos } from "../controller/modos/cart.modos.js";
import { sessionAuth } from "../controller/utils.js";
const routes = Router();

routes.get("/", cartModos.getProducts);
routes.get("/:cid", cartModos.productsCartById);
routes.post("/", cartModos.createCart);
routes.post("/:cid/product/:pid",sessionAuth("self"), cartModos.addProductToCart);
routes.delete("/:cid/products",cartModos.deleteProducts);
routes.delete("/:cid/products/:pid",cartModos.deleteProduct);
routes.put("/:cid/products/:pid/:qty",cartModos.addQuantity);
export default routes;
