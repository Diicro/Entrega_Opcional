import { Router } from "express";
import { productsModos } from "../controller/modos/products.modos.js";
import { roleAuth, sessionAuth } from "../controller/utils.js";


const routes = Router();

routes.get("/all",sessionAuth, productsModos.getProducts);
routes.get("/:pid",sessionAuth, productsModos.getProductsById);
routes.post("/",sessionAuth,roleAuth(["admin","premium"]), productsModos.addProduct);
routes.post("/update",sessionAuth,roleAuth("admin"), productsModos.upDateProduct);
routes.delete("/:pid",sessionAuth,roleAuth(["admin","premium"]), productsModos.deleteProduct);
routes.all('*', async (req, res) => {throw new CustomError(errorDicctionary.ROUTING_ERROR)});
export default routes;
