import path from "path";

const config = {
  PORT: 8080,
  DIRNAME: path.dirname(
    new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:\/)/, "$1")
  ),
  MONGODB_URI:
    "mongodb+srv://diicrowork:M8piPWGCmktHjOzW@cluster0.vbrk7fl.mongodb.net/clasebcknd",
  MONGODB_ID_REGEX: /^[a-fA-F0-9]{24}$/,
  GITHUB_CLIENT_ID:"Iv23liUTWchMQnsezOxa",
  GITHUB_CLIENT_SECRET:"80f918805c9759fb75eb4d09a591bb76825cb966",
  GITHUB_CALLBACK_URI:"http://localhost:8080/api/sessions/ghlogincallback"
};

export default config;
