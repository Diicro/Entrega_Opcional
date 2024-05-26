import path from "path";

const config = {
  PORT: 8080,
  DIRNAME: path.dirname(
    new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:\/)/, "$1")
  ),
  MONGODB_URI:
    "mongodb+srv://diicrowork:M8piPWGCmktHjOzW@cluster0.vbrk7fl.mongodb.net/clasebcknd",
  MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/,
};

export default config;
