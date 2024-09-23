import path from "path";
import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: 8080,
  MODE: "dev",
  DIRNAME: path.dirname(
    new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:\/)/, "$1")
  ),
  get UPLOAD_DIR() {
    return `${this.DIRNAME}/uploads`;
  },

  SWANGGER_OPTIONS: {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Documentacion Fashapets",
        description:
          "Esta documentación cubre toda la API habilitada para Fashapets",
      },
    },
    apis: [path.resolve(__dirname, "./src/docs/**/*.yaml")],
  },
  SECRET: process.env.SECRET,
  MONGODB_URI:
    "mongodb+srv://diicrowork:M8piPWGCmktHjOzW@cluster0.vbrk7fl.mongodb.net/clasebcknd",
  MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URI: process.env.GITHUB_CALLBACK_URI,
  GMAIL_APP_PASS: process.env.GMAIL_APP_PASS,
  GMAIL_APP_USER: process.env.GMAIL_APP_USER,
};

export default config;
