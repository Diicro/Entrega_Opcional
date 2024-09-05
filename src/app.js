import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import session from "express-session";
import FileStore from "session-file-store";
import passport from "passport";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import viewsRoutes from "./routes/views.routes.js";
import productsRoutes from "./routes/products.routes.js";
import cartsRoutes from "./routes/cart.routes.js";
import loginRoutes from "./routes/login_singnin.routes.js";
import userRoutes from "./routes/users.routes.js";
import chatModel from "./dao/models/chat.model.js";
import config from "./config.js";
import errorsHandler from "./controller/error.handler.js";
import addLogger from "./controller/logger.js";
import cluster from "cluster";
import { cpus } from "os";

if (cluster.isPrimary) {
  for (let i = 0; i < cpus().length; i++) cluster.fork();

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Se cayó la instancia ${worker.process.pid}`);
    cluster.fork();
  });
} else {
  const app = express();
  const fileStoreage = FileStore(session);
  app.use(
    session({
      store: new fileStoreage({ path: "./sessions", ttl: 300, retries: 1 }),
      secret: "secret_code113",
      resave: true,
      saveUninitialized: true,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.engine("handlebars", handlebars.engine());
  app.set("views", `${config.DIRNAME}/views`);
  app.set("view engine", "handlebars");
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(addLogger);
  app.use("/views", viewsRoutes);
  app.use("/api/products", productsRoutes);
  app.use("/api/carts", cartsRoutes);
  app.use("/api/sessions", loginRoutes);
  app.use("/api/users", userRoutes);
  app.use(
    "/api/document",
    swaggerUiExpress.serve,
    swaggerUiExpress.setup(swaggerJsdoc(config.SWANGGER_OPTIONS))
  );
  app.use(errorsHandler);
  app.use("/uploads",express.static(config.UPLOAD_DIR))

  const httpserver = app.listen(config.PORT, async () => {
    await mongoose.connect(config.MONGODB_URI);
    console.log(`Puerto ${config.PORT} escuchando`);
  });

  const socketServer = new Server(httpserver);
  app.set("socketServer", socketServer);

  socketServer.on("connection", async (client) => {
    console.log(`Cliente conetado id ${client.id}`);
    const messagesLog = await chatModel.find().lean();
    client.emit("chatLog", messagesLog);
    console.log(
      `Cliente conectado, id ${client.id} desde ${client.handshake.address}`
    );

    client.on("newMessage", async (data) => {
      const messageMdb = await chatModel.create({
        user: data.user,
        message: data.message,
      });
      console.log(
        `Mensaje recibido desde ${client.id}: ${data.user} ${data.message}`
      );

      socketServer.emit("messageArrived", messageMdb);
    });
  });
}
