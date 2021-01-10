const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const logrotate = require("logrotator");
var rotator = logrotate.rotator;
const crypto = require("crypto");
const os = require("os");
let path = require("path");
var filename = path.basename(__filename);

const Logger = require("./services/logger");
const bodyParser = require("body-parser");

const logger = new Logger("app");

app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);

app.use(bodyParser.json());

rotator.register("./logs/app.log", {
    schedule: "5s",
    size: "5m",
    compress: true,
    count: 10,
});

rotator.on("error", function (err) {
    console.log("oops, an error occured!");
});

rotator.on("rotate", function (file) {
    console.log("file " + file + " was rotated!");
});

app.get("/", (req, res) => {
    return res.json({ message: "It's working" });
});

app.post("/test", (req, res) => {
    const body = req.body;

    let error = {};

    logger.setLogData(body);

    logger.info("Request recieved at /test", {
        file_name: filename,
        thread_id: process.pid,
        func_name: "Test Route",
    });

    if (body.name == null || body.name == "") {
        logger.error("Name field is empty", {
            file_name: filename,
            thread_id: process.pid,
            func_name: "Body Name not present",
        });
        error["name"] = "name field is empty";
    }

    if (body.age == null || body.age == "") {
        logger.error("Age field is empty", {
            file_name: filename,
            thread_id: process.pid,
            func_name: "Age field not present",
        });
        error["age"] = "age field is empty";
    }

    if (body.gender == null || body.gender == "") {
        logger.error("Gender field is empty", {
            file_name: filename,
            thread_id: process.pid,
            func_name: "Gender not present",
        });
        error["gender"] = "gender field is empty";
    }

    if (Object.keys(error).length != 0) {
        logger.error("Return error response", {
            success: false,
            file_name: filename,
            thread_id: process.pid,
            func_name: "Test Route",
        });
        return res.send("Error");
    } else {
        logger.info("Return success response", {
            success: true,
            file_name: filename,
            thread_id: process.pid,
            func_name: "Test Route",
        });
    }
    return res.send("No error");
});

app.listen(PORT, () => {
    logger.info(`Server running on PORT ${PORT}`, {
        file_name: filename,
        thread_id: process.pid,
        func_name: "Port Start",
    });
});
