import { Router } from "express";
import { productsModos } from "../controller/modos/products.modos.js";
import { roleAuth, sessionAuth, upload } from "../controller/utils.js";

const routes = Router();

routes.get("/all", sessionAuth, productsModos.getProducts);
routes.get("/:pid", sessionAuth, productsModos.getProductsById);
routes.post(
  "/products",
  upload.single("thumbnail"),
  sessionAuth,
  roleAuth(["admin", "premium"]),
  productsModos.addProduct
);
routes.post(
  "/update/products",
  upload.single("thumbnailUpdate"),
  sessionAuth,
  roleAuth("admin"),
  productsModos.upDateProduct
);
routes.delete(
  "/:pid",
  sessionAuth,
  roleAuth(["admin", "premium"]),
  productsModos.deleteProduct
);
routes.all("*", async (req, res, next) => {
  next(new CustomError(errorDicctionary.ROUTING_ERROR));
});
export default routes;
