import { errorDicctionary } from "./errorsDictionary.js";

const errorsHandler = (error, req, res, next) => {
  let customErr = errorDicctionary[0];
  for (const key in errorDicctionary) {
    if (errorDicctionary[key].code === error.type.code) {
      customErr = errorDicctionary[key];
    }
  }
  console.log(customErr.message);
  return res.status(customErr.status).send({ payload: customErr.message });
};

export default errorsHandler;
