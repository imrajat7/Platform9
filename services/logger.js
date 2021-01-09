const winston = require("winston");

dateFormat = () => {
    return new Date(Date.now()).toUTCString();
};

class LoggerService {
    constructor(route) {
        this.log_data = null;
        this.route = route;
        const logger = winston.createLogger({
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: `./logs/${route}.log`,
                }),
            ],
            format: winston.format.printf((info) => {
                let otherData = info.obj;
                let message = `${dateFormat()} | ${info.level.toUpperCase()} | ${
                    otherData.file_name
                } | ${otherData.thread_id} | ${otherData.func_name} | ${
                    info.message
                } |`;

                return message;
            }),
        });
        this.logger = logger;
    }

    setLogData(log_data) {
        this.log_data = log_data;
    }

    async info(message) {
        this.logger.log("info", message);
    }

    async info(message, obj) {
        this.logger.log("info", message, {
            obj,
        });
    }

    async debug(message) {
        this.logger.log("debug", message);
    }

    async debug(message, obj) {
        this.logger.log("debug", message, {
            obj,
        });
    }

    async error(message) {
        this.logger.log("error", message);
    }

    async error(message, obj) {
        this.logger.log("error", message, {
            obj,
        });
    }
}

module.exports = LoggerService;
