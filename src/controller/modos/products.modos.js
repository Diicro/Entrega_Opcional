import productsModel from "../../dao/models/products.model.js";
import CustomError from "../customError.js";
import { errorDicctionary } from "../errorsDictionary.js";
import CollectionManager from "./modos.manager.js";

class productDTO {
  constructor(data, file, id, user) {
    this.id = +id;
    this.title = data.title;
    this.description = data.description;
    this.price = +data.price;
    this.thumbnail = file.filename || "[]";
    this.code = +data.code;
    this.stock = +data.stock;
    this.status = true;
    this.category = data.category;
    this.owner = user.email;
    this.rol = user.rol;
  }
}

const manager = new CollectionManager();

export const productsModos = {
  getProducts: async (req, res) => {
    try {
      const limit = +req.query.limit;
      const page = +req.query.page;
      const category = req.query.category;
      const sort = req.query.sort ? { price: +req.query.sort } : {};

      const filter = category ? { category: category } : {};
      const option = {
        limit: limit || 3,
        page: page || 1,
        sort: sort,
      };
      const products = await manager.getAll(filter, option);

      res.status(200).send({ products });
    } catch (error) {
      req.logger.error("Error al acceder a la base datos");
      throw new CustomError(errorDicctionary.DATABASE_ERROR);
    }
  },

  getProductsById: async (req, res) => {
    try {
      const id = req.params.pid;
      const objectById = await manager.getId(id);
      res.status(200).send({ ...objectById });
    } catch (error) {
      req.logger.error("Error al acceder a la base datos");
      throw new CustomError(errorDicctionary.ID_NOT_FOUND);
    }
  },

  addProduct: async (req, res, next) => {
    try {
      let id;

      const products = await productsModel.find({}).lean();
      products.length < 1 ? (id = -1) : (id = products.length - 1);

      const productNomalized = new productDTO(
        req.body,
        req.file,
        id + 1,
        req.session.user
      );

      const completeSpace = Object.values(productNomalized).includes(undefined);
      const productseasy = [...products];
      const codeExiste = productseasy.some(
        (element) => element.code === productNomalized.code
      );

      if (completeSpace) {
        req.logger.warn("Faltan parametros del producto");
        next(new CustomError(errorDicctionary.FEW_PARAMETERS));
      } else if (codeExiste) {
        req.logger.info("El codigo ya existe");
        next(new CustomError(errorDicctionary.CODE_EXIST));
      } else {
        const socketServer = req.app.get("socketServer");
        req.logger.debug(productNomalized);
        const addProduct = await manager.addProduct(productNomalized);

        res
          .status(200)
          .send(`se agregó correctamente el producto ${addProduct}`);

        const productos = await productsModel.find({}).lean();
        socketServer.emit("upGradeProducts", productos);
      }
    } catch (error) {
      req.logger.error("Error al acceder a la base datos");
      next(new CustomError(errorDicctionary.DATABASE_ERROR));
    }
  },

  upDateProduct: async (req, res, next) => {
    try {
      const id = +req.body.id;
      const filter = { id: id };
      const update = req.body;
      const options = { new: true };
      console.log("Entra");
      const products = await productsModel.find({}).lean();

      const productNormalized = new productDTO(req.body, id);

      const sameCode = products.some(
        (elemet) => productNormalized.code === elemet.code
      );
      if (sameCode) {
        console.log("same code");
        req.logger.info("El codigo ya existe");

        next(new CustomError(errorDicctionary.CODE_EXIST));
      } else {
        console.log("Entra actu");

        const updates = await manager.update(
          filter,
          update,
          options,
          products,
          id
        );

        res
          .status(200)
          .send(`Actualización de producto: ${updates.title} ha sido exitoso`);
      }
    } catch (error) {
      req.logger.error("Error al acceder a la base datos");
      next(new CustomError(errorDicctionary.DATABASE_ERROR));
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const getProducts = await productsModel.find({}).lean();

      const id = +req.params.pid;
      const upgrateArray = getProducts.filter((element) => element.id !== id);

      if (getProducts.length === upgrateArray.length) {
        req.logger.warn("El producto a eliminar no existe");
        throw new CustomError(errorDicctionary.ID_NOT_FOUND);
      } else if (req.session.user.rol === "admin") {
        const socketServer = req.app.get("socketServer");
        const deleteProduct = await manager.delete(id, upgrateArray);
        req.logger.info(`Eliminó el producto ${deleteProduct}`);
        res.status(200).send(`Eliminado:${deleteProduct}`);

        const products = await productsModel.find({}).lean();
        socketServer.emit("upGradeProducts", products);
      } else {
        const productToDelete = await productsModel.findOne({ id: id });
        if (productToDelete.owner === req.session.user.email) {
          const socketServer = req.app.get("socketServer");
          const deleteProduct = await manager.delete(id, upgrateArray);
          req.logger.info(`Eliminó el producto ${deleteProduct}`);
          res.status(200).send(`Eliminado:${deleteProduct}`);

          const products = await productsModel.find({}).lean();
          socketServer.emit("upGradeProducts", products);
        } else {
          throw new CustomError(errorDicctionary.AUTHENTICATION);
        }
      }
    } catch (error) {
      req.logger.error("Error al acceder a la base datos");
      throw new CustomError(errorDicctionary.DATABASE_ERROR);
    }
  },
};
