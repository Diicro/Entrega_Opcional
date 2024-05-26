import fs from "fs";
import path from "path";
import config from "../config.js";
import { Socket } from "socket.io";
import productsModel from "../dao/models/products.model.js";

const upath = path.join(config.DIRNAME, "../src/dao/products.json");

let productslocal = JSON.parse(fs.readFileSync(upath, "utf-8"));

export const productsModos = {
  getProducts: async (req, res) => {
    const limit = req.query.limit;
    const products = await productsModel.find({}).lean().sort({id:1})
    if (limit) {
      if (limit >= products.length) {
        
        res.status(200).send({ ...products });
      } else {
        const newArraylimit1 = await productsModel.find({}).limit(req.query.limit).sort({id:1});
        res.status(200).send({ ...newArraylimit1 });
      }
    } else {
      const products = await productsModel.find({}).lean();

      res.status(200).send({ ...products });
    }
  },

  getProductsById: async (req, res) => {
    const id = req.params.pid;
    const objectById = await productsModel.find({ id: id });
    if (objectById.length > 0) {
      res.status(200).send({ ...objectById });
    } else {
      res.send("<h1>Error!! Producto no encontrado</h1>");
    }
  },

  addProduct: async (req, res) => {
    let id;
    const socketServer = req.app.get("socketServer");

    const products = await productsModel.find({}).lean();
    products.length < 1 ? (id = -1) : (id = products.length - 1);

    const product = {
      id: id + 1,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      thumbnail: req.body.thumbnail || [],
      code: req.body.code,
      stock: req.body.stock,
      status: true,
      category: req.body.category
    };
    const completeSpace = Object.values(product).includes(undefined);
    const productseasy = [...products];
    const codeExiste = productseasy.some(
      (element) => element.code === product.code
    );
    if (completeSpace) {
      res
        .status(400)
        .send({ payload: [], error: "Todos los campos solicitados" });
    } else if (codeExiste) {
      res.status(400).send({ payload: [], error: "El codigo ya existe" });
    } else {
      productslocal.push(product);
      fs.writeFileSync(upath, JSON.stringify(productslocal));
      const newproduct = await productsModel.create(req.body);
      const products = await productsModel.find({}).lean();

      res.status(200).send(`se agregó correctamente el producto ${newproduct}`);

      socketServer.emit("upGradeProducts", products);
    }
  },

  upDateProduct: async (req, res) => {
    const id = +req.params.pid;
    const filter = { id: id };
    const update = req.body;
    const options = { new: true };
    const product = {
      id: id,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      thumbnail: req.body.thumbnail || [],
      code: req.body.code,
      stock: req.body.stock,
      status: true,
      category: req.body.category,
    };

    const products = await productsModel.find({}).lean();


    const sameCode = products.some((elemet) => product.code === elemet.code);
    if (sameCode) {
      res.status(400).send({ payload: [], error: "El codigo ya existe" });
      } else if (req.body.id !== id) {
      res.status(400).send({ payload: [], error: "No se puede cambiar el id" });
    } else {
      products.splice(id, 1, product);
      fs.writeFileSync(upath, JSON.stringify(products));

      const updateProduct = await productsModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      res.status(200).send(`producto actualizado ${updateProduct}`);
    }
  },
  deleteProduct: async (req, res) => {
    const products = await productsModel.find({}).lean();

    const id = +req.params.pid;
    const socketServer = req.app.get("socketServer");
    const getProducts = products;
    const upgrateArray = getProducts.filter((element) => element.id !== id);

    if (getProducts.length === upgrateArray.length) {
      res.status(400).send({ payload: [], error: "Producto no encontrado" });
    } else {
      productslocal = [...upgrateArray];

      fs.writeFileSync(upath, JSON.stringify(productslocal));
      const deleteProduct = await productsModel.findOneAndDelete({ id: id });
      const products = await productsModel.find({}).lean();

      res.status(200).send(`Se elimino el producto:${deleteProduct}`);

      socketServer.emit("upGradeProducts", products);
    }
  },
};
