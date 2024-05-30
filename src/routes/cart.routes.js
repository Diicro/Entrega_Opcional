import { Router } from "express";
import { cartModos } from "../modos/cart.modos.js";

const routes = Router();

routes.get("/", cartModos.getProducts);
routes.get("/:cid", cartModos.productsCartById);
routes.post("/", cartModos.createCart);
routes.post("/:cid/product/:pid", cartModos.addProductToCart);
routes.delete("/:cid/products",cartModos.deleteProducts);
routes.delete("/:cid/products/:pid",cartModos.deleteProduct);
routes.put("/:cid/products/:pid/:qty",cartModos.addQuantity);
export default routes;
