import { Router } from "express";
import { productsModos } from "../controller/modos/products.modos.js";
import { roleAuth, sessionAuth } from "../controller/utils.js";


const routes = Router();

routes.get("/", productsModos.getProducts);
routes.get("/:pid", productsModos.getProductsById);
routes.post("/",sessionAuth,roleAuth("Admin"), productsModos.addProduct);
routes.post("/update",sessionAuth,roleAuth("Admin"), productsModos.upDateProduct);
routes.delete("/:pid",sessionAuth,roleAuth("Admin"), productsModos.deleteProduct);
export default routes;
