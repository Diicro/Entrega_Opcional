import CustomError from "./customError.js";
import { errorDicctionary } from "./errorsDictionary.js";

const errorsHandler = (error, req, res, next) => {

    let customErr = errorDicctionary.UNHANDLED_ERROR;

    if (error instanceof CustomError) {

        customErr = errorDicctionary[error.type] || customErr;
    } else if (error.type && error.type.code !== undefined) {

        for (const key in errorDicctionary) {
            if (errorDicctionary[key].code === error.type.code) {
                customErr = errorDicctionary[key];
                break; 
            }
        }
    }


    return res.status(customErr.status).send({ payload: '', error: customErr.message });
}


export default errorsHandler;