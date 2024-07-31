import winston from "winston";
import config from "../config.js"


const devLogger=winston.createLogger({
    transports:[
        new winston.transports.Console({level:"debug"}),
        new winston.transports.File({level:"error",filename:`${config.DIRNAME}/logs/errors.log`}),



    ]
})
const productionLogger= winston.createLogger({
    transports:[
        new winston.transports.Console({level:"info"}),
        new winston.transports.File({level:"error",filename:`${config.DIRNAME}/logs/errors.log`}),

    ]
})

const addLogger=(req,res,next)=>{

    req.logger=config.MODE==="dev"?devLogger:productionLogger;

    req.logger.info(`${new Date().toDateString()} ${req.url} ${req.method} `)

    next()
}
export default addLogger;


