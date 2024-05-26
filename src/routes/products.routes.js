import { Router } from "express";
import { productsModos } from "../modos/products_modos.js";

const routes = Router();

routes.get("/", productsModos.getProducts);
routes.get("/:pid", productsModos.getProductsById);
routes.post("/", productsModos.addProduct);
routes.put("/:pid", productsModos.upDateProduct);
routes.delete("/:pid", productsModos.deleteProduct);
export default routes;
