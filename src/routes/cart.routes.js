import { Router } from "express";
import { cartModos } from "../controller/modos/cart.modos.js";
import { sessionAuth,roleAuth } from "../controller/utils.js";
import CustomError from "../controller/customError.js";
import { errorDicctionary } from "../controller/errorsDictionary.js";
const routes = Router();

routes.get("/",roleAuth("admin"), cartModos.getProducts);
routes.get("/:cid",roleAuth("admin"), cartModos.productsCartById);
routes.post("/",roleAuth("admin"), cartModos.createCart);
routes.post("/:cid/product/:pid",sessionAuth,roleAuth(["user","premium"]), cartModos.addProductToCart);
routes.delete("/:cid/products",roleAuth("admin"),cartModos.deleteProducts);
routes.delete("/:cid/products/:pid",roleAuth("admin"),cartModos.deleteProduct);
routes.put("/:cid/products/:pid/:qty",roleAuth("admin"),cartModos.addQuantity);
routes.post("/:cid/purchase",roleAuth("user"),cartModos.addTicket);
routes.all('*', async (req, res) => {throw new CustomError(errorDicctionary.ROUTING_ERROR)});
export default routes;
