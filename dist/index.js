"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('./_env'); // Load environment vars before anything.
const logger_1 = require("./logger");
const webserver_1 = require("./webserver");
const node_graceful_1 = __importDefault(require("node-graceful"));
// Shutdown gracefully on any unhandled exception, rejection or signal.
node_graceful_1.default.captureExceptions = true;
node_graceful_1.default.captureRejections = true;
node_graceful_1.default.on('exit', async () => {
    // stops the webserver
    await webserver_1.stopServer();
});
// Makes sure the required environment variables are defined.
function verifyEnv() {
    ['IP_GEOLOCATION_KEY', 'PORT'].forEach((envVar) => {
        if (!process.env[envVar]) {
            logger_1.log(`Fatal Error! Missing environment variable ${envVar}`);
            process.exit(1);
        }
    });
}
// starts the service.
async function run() {
    logger_1.log('Starting service');
    // verify environment before anything.
    verifyEnv();
    // start the web server.
    await webserver_1.initServer();
}
run();
