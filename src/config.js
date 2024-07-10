import path from "path";
import dotenv from "dotenv";

dotenv.config()


const config = {
  PORT: 8080,
  DIRNAME: path.dirname(
    new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:\/)/, "$1")
  ),
  MONGODB_URI:
    "mongodb+srv://diicrowork:M8piPWGCmktHjOzW@cluster0.vbrk7fl.mongodb.net/clasebcknd",
  MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/,
  GITHUB_CLIENT_ID:process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET:process.env.GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URI:process.env.GITHUB_CALLBACK_URI
};

export default config;
