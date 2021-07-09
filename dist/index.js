"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('./_env');
const logger_1 = require("./logger");
const webserver_1 = require("./webserver");
function verifyEnv() {
    ['IP_GEOLOCATION_KEY', 'PORT'].forEach((envVar) => {
        if (!process.env[envVar]) {
            logger_1.log(`Fatal Error! Missing environment variable ${envVar}`);
            process.exit(1);
        }
    });
}
async function run() {
    logger_1.log('Starting service');
    verifyEnv();
    await webserver_1.initServer();
}
run();
