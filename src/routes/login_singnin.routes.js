import { Router } from "express";
import userModel from "../dao/models/user.model.js";
import passport from "passport";
import initAuthStrategy from "../controller/auth/passport.strategies.js";
import {
  sessionAuth,
  createToken,
  verifyToken,
  transport,
} from "../controller/utils.js";
import CustomError from "../controller/customError.js";
import { errorDicctionary } from "../controller/errorsDictionary.js";
import config from "../config.js";
import bcrypt, { hash } from "bcrypt";
import { cartModos } from "../controller/modos/cart.modos.js";

const routes = Router();
initAuthStrategy();

class userDTO {
  constructor(user) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.rol = user.rol;
  }
}

routes.post(
  "/register",
  passport.authenticate("register"),
  async (req, res, next) => {
    req.session.user = req.user;
    try {
      if (req.user === "false") {
        req.logger.error("Email ya existe");
        next(new CustomError(errorDicctionary.EMAIL_EXIST));
      } else {
        await userModel.create(req.user);
        res.redirect("/views/login");
      }
    } catch (error) {
      req.logger.error("Error al acceder a la base datos");
      res.status(500).send(error.message);
    }
  }
);

routes.post("/pplogin", passport.authenticate("login"), async (req, res) => {
  req.session.user = req.user;
  try {
    if (req.user === "false") {
      req.logger.error("datos invalidos");
      res.status(404).send("Datos no validos");
    } else {
      req.session.save(async (error) => {
        if (error) {
          return res.send(errorDicctionary.UNHANDLED_ERROR);
        }
        await userModel.findOneAndUpdate(
          { email: req.session.user.email },
          {
            last_connection: new Date(),
          },
          { new: true }
        );
        res.redirect("/views/products");
      });
    }
  } catch (error) {
    req.logger.error("Error al acceder a la base datos");
    res.status(500).send(error.message);
  }
});
routes.get(
  "/ghlogin",
  passport.authenticate("ghlogin", { scope: ["user:email"] }),
  async (req, res) => {}
);

routes.get(
  "/ghlogincallback",
  passport.authenticate("ghlogin", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      req.session.user = req.user;
      if (req.user === "false") {
        res.status(401).send({ payload: "Faltan datos de usuario en GitHub" });
      } else {
        const newCart = await cartModos.createCart();
        const filter = { email: req.session.user.email };
        const update = { cart: newCart,last_connection:new Date()};
        const newUser = await userModel.findOneAndUpdate(filter, update, {
          new: true,
        });
        req.session.user = newUser;

        req.session.save((error) => {
          if (error) {
            return res.send(errorDicctionary.UNHANDLED_ERROR);
          } else {
            res.redirect("/views/products");
          }
        });
      }
    } catch (error) {
      return done(error, false);
    }
  }
);

routes.post("/verifyemail", async (req, res, next) => {
  const email = req.body.email;
  const user = await userModel.findOne({ email: email }).lean();

  if (!user) {
    return next(new CustomError(errorDicctionary.ID_NOT_FOUND));
  } else {
    const token = createToken({ email }, "5m");

    await transport.sendMail({
      from: `FachaPets <${config.GMAIL_APP_USER}>`,
      to: email,
      subject: "Cambio de contraseña",
      html: `<h1>Restaurar constraseña: https://entrega-opcional.onrender.com/views/cambiocontrasena?token=${token}</h1>
            <div>Si usted no ha sido,ignore este correo</div>`,
    });
    res
      .status(200)
      .send({ payload: "se ha enviado un Link a su correo electronico" });
  }
});
routes.post("/changedpassword", verifyToken, async (req, res, next) => {
  try {
    const newPassword = await bcrypt.hash(req.body.newPassword, 10);

    const filter = { email: req.user.email };
    const update = { passWord: newPassword };

    const user = await userModel.findOne(filter).lean();

    if (!bcrypt.compareSync(req.body.newPassword, user.passWord)) {
      await userModel.findOneAndUpdate(filter, update, {
        new: true,
      });
      res.status(200).send(`<h1>Contraseña ha sido cambiada con exito</h1>`);
    } else {
      next(new CustomError(errorDicctionary.PASSWORD_SAME));
    }
  } catch (error) {
    next(new CustomError(errorDicctionary.DATABASE_ERROR));
  }
});
routes.get("/current", sessionAuth, async (req, res) => {
  try {
    const userToObject = new userDTO(req.session.user);
    res.status(201).send({ usuario: userToObject });
  } catch (error) {
    res.status(404).send({
      error: error.message,
      payload: "Tenemos problemas con tu usuario intenta mas tarde",
    });
  }
});
routes.all("*", async (req, res) => {
  throw new CustomError(errorDicctionary.ROUTING_ERROR);
});
export default routes;
