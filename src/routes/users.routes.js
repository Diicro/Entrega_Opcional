import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import CustomError from "../controller/customError.js";
import { errorDicctionary } from "../controller/errorsDictionary.js";
import { roleAuth, sessionAuth, upload } from "../controller/utils.js";

const routes = Router();

routes.post("/premium", roleAuth(["admin"]), async (req, res, next) => {
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
  console.log(user.documents);
  if (user && update.rol === "user") {
    const userUpdate = await userModel.findOneAndUpdate(filter, update, option);
    res
      .status(200)
      .send({ payload: "Se actualizo el rol del usuario satisfactoriamente" });
  } else if (user && update.rol === "premium" && filterDocument) {
    await userModel.findOneAndUpdate(filter, update, option);
    res
      .status(200)
      .send({ payload: "Se actualizo el rol del usuario satisfactoriamente" });
  } else {
    return next(new CustomError(errorDicctionary.RECORD_CREATION_ERROR));
  }
});

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

export default routes;
