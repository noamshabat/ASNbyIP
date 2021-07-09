"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopServer = exports.initServer = void 0;
const express_1 = __importDefault(require("express"));
const logger_1 = require("./logger");
const ipGeoApi_1 = require("./ipGeoApi");
let server;
// setup app routes
function initRoutes(app) {
    app.get('/test', (req, res) => {
        res.sendStatus(200);
    });
    app.get('/shutdown', (req, res) => {
        res.status(200).send('Shutting down');
        stopServer();
    });
    app.get('/getip', async (req, res, next) => {
        try {
            const ip = req.query.ip;
            const region = await ipGeoApi_1.ip2region(ip);
            res.status(200).send(region);
        }
        catch (err) {
            next(err);
        }
    });
    app.get('*', function (req, res) {
        res.status(404).send('unknown route');
    });
}
async function errorMiddleware(err, req, res, next) {
    if (err.serviceException) {
        res.status(err.code).send(err.message);
    }
    else {
        const msg = JSON.stringify(err);
        res.status(500).send(msg);
    }
}
function initServer() {
    const app = express_1.default();
    const port = process.env.PORT;
    app.use(express_1.default.json());
    initRoutes(app);
    app.use(errorMiddleware);
    return new Promise((resolve) => {
        server = app.listen(port, () => {
            logger_1.log(`Express listening at http://localhost:${port}`);
            resolve();
        });
    });
}
exports.initServer = initServer;
async function stopServer() {
    logger_1.log('Web server shutting down');
    if (server) {
        await new Promise((res) => {
            try {
                server.close(res);
            }
            catch (err) {
                logger_1.log('Error while shutting down', err);
                process.exit(1);
            }
        });
    }
}
exports.stopServer = stopServer;
