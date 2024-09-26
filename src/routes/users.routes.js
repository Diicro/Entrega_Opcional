import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import CustomError from "../controller/customError.js";
import { errorDicctionary } from "../controller/errorsDictionary.js";
import {
  roleAuth,
  sessionAuth,
  transport,
  upload,
} from "../controller/utils.js";

const routes = Router();

class userDTO {
  constructor(user) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.rol = user.rol;
  }
}

routes.get(
  "/userinfo",
  sessionAuth,
  roleAuth(["admin"]), async (req, res, next) => {
    try {
      const users = await userModel.find({}).lean();

      const arrayUsers =await Promise.all(users.map(async (element) => {
          const userNormalized= new userDTO(element);
          return userNormalized
        }))
      res
        .status(200)
        .send({ message: "usuarios base de datos", payload: arrayUsers });
    } catch (error) {
      next(new CustomError(errorDicctionary.DATABASE_ERROR));
    }
  })
;

routes.post(
  "/premium",
  sessionAuth,
  roleAuth(["admin"]),
  async (req, res, next) => {
    const filter = { email: req.body.uid };
    const update = { rol: req.body.rol };
    const option = { new: true };
    const user = await userModel.findOne(filter).lean();
    const filterDocument = await user.documents.find((element) =>
      [
        "identificación",
        "comprobante de domicilio",
        "comprobante de estado de cuenta",
      ].some((keyword) => element.name.includes(keyword))
    );

    if (user && update.rol === "user") {
      const userUpdate = await userModel.findOneAndUpdate(
        filter,
        update,
        option
      );
      res.status(200).send({
        payload: "Se actualizo el rol del usuario satisfactoriamente",
      });
    } else if (user && update.rol === "premium" && filterDocument) {
      await userModel.findOneAndUpdate(filter, update, option);
      res.status(200).send({
        payload: "Se actualizo el rol del usuario satisfactoriamente",
      });
    } else {
      return next(new CustomError(errorDicctionary.RECORD_CREATION_ERROR));
    }
  }
);

routes.post(
  "/documents",
  upload.single("documents"),
  sessionAuth,
  async (req, res, next) => {
    try {
      await userModel.findOneAndUpdate(
        { email: req.session.user.email },
        {
          documents: [
            { name: req.file.filename, reference: req.file.filename },
          ],
        },
        { new: true }
      );

      res.status(200).send({ payload: "Documentos subidos con exito" });
    } catch (error) {
      next(new CustomError(errorDicctionary.DATABASE_ERROR));
    }
  }
);

routes.delete(
  "/delete",
  sessionAuth,
  roleAuth(["admin"]), async (req, res, next) => {
    try {
      console.log("entras")

      const dateDb = await userModel.find({}).lean();
      let users = 0;
      dateDb.forEach(async (element) => {
      console.log("entra 2s")
console.log(element.last_connection)
console.log(new Date())

        const diferenceTime = element.last_connection - new Date();
        console.log(diferenceTime);
        if (diferenceTime / 1800000 > 1) {
      console.log("entras 3s")

          await userModel.deleteOne({ email: element.email });
          transport.sendMail({
            from: `FachaPets <${config.GMAIL_APP_USER}>`,
            to: element.email,
            subject: `Cuenta Eliminada`,
            hatml: `<h1>Aviso Cuenta eliminada</h1><div>Su cuenta ha sido eliminada debido a la inactividad,gracias por elegirnos.</div>`,
          });
          users++;
        }
      });
      res
        .status(200)
        .send(
          `Se eliminaron: ${users} usuarios por inactividad mayor a 30 min`
        );
    } catch (error) {
      next(new CustomError(errorDicctionary.DATABASE_ERROR));
    }
  })
;

export default routes;
