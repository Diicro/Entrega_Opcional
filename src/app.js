import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import productsRoutes from "./routes/products.routes.js";
import cartsRoutes from "./routes/cart.routes.js";
import viewsRoutes from "./routes/views.routes.js";
import config from "./config.js";
import mongoose from "mongoose";
import chatModel from "./dao/models/chat.model.js"

const app = express();
app.engine("handlebars", handlebars.engine());
app.set("views", `${config.DIRNAME}/views`);
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/views", viewsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRoutes);
const httpserver = app.listen(config.PORT, async () => {
  await mongoose.connect(config.MONGODB_URI);
  console.log(`Puerto ${config.PORT} escuchando`);
});

const socketServer = new Server(httpserver);
app.set("socketServer", socketServer);


socketServer.on("connection",async (client) => {
  console.log(`Cliente conetado id ${client.id}`);
  const messagesLog =await  chatModel.find().lean();
  client.emit("chatLog", messagesLog);
  console.log(
    `Cliente conectado, id ${client.id} desde ${client.handshake.address}`
  );

  client.on("newMessage", async(data) => {
    const messageMdb= await chatModel.create({user:data.user,message:data.message})
    console.log(
      `Mensaje recibido desde ${client.id}: ${data.user} ${data.message}`
    );

    socketServer.emit("messageArrived", messageMdb);
  });
});
