import config from "../config.js";
import nodemailer from "nodemailer";
import { errorDicctionary } from "./errorsDictionary.js";
import CustomError from "./customError.js";
import jwt from "jsonwebtoken";
import path from "path";
import multer from "multer";
import fs from "fs";

export const createToken = (payload, time) =>
  jwt.sign(payload, config.SECRET, { expiresIn: time });

export const verifyToken = (req, res, next) => {
  const token = req.query.token;

  if (!token) {
    res.redirect(
      `https://entrega-opcional.onrender.com/views/tokeninvalid?error=Token no valido o caducado`
    );
  } else {
    jwt.verify(token, config.SECRET, (err, payload) => {
      if (err) {
        res.redirect(
          `https://entrega-opcional.onrender.com/views/tokeninvalid?error=Token no valido o caducado`
        );
      } else {
        req.user = { email: payload.email, token: token };
        console.log(req.user);
        next();
      }
    });
  }
};
export const sessionAuth = (req, res, next) => {
  if (!req.session.user) {
    throw new CustomError(errorDicctionary.LOG_OUT);
  } else {
    next();
  }
};

export const roleAuth = (role) => {
  return (req, res, next) => {
    if (!role.includes(req.session.user.rol)) {
      return next(new CustomError(errorDicctionary.AUTHENTICATION));
    } else {
      return next();
    }
  };
};
export const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.GMAIL_APP_USER,
    pass: config.GMAIL_APP_PASS,
  },
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subFolder = path.basename(req.path);

    const uploadDir = path.join(config.UPLOAD_DIR, subFolder);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const extencion = path.extname(file.originalname);
    cb(null, `${req.body.title}_${req.session.user.firstName}${extencion}`);
  },
});
export const upload = multer({ storage: storage });
