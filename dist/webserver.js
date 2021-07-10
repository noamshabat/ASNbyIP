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
/**
 * Initializes all app routes
 * @param app - an express instance.
 */
function initRoutes(app) {
    // test route - just to make sure the webserver is running.
    app.get('/test', (req, res) => {
        res.sendStatus(200);
    });
    // shuts down the service.
    app.get('/shutdown', (req, res) => {
        res.status(200).send('Shutting down');
        stopServer();
    });
    // get the country code for the given ip. expects a query parameter 'ip'.
    app.get('/ip2country', async (req, res, next) => {
        try {
            const ip = req.query.ip;
            const countryCode = await ipGeoApi_1.ip2CountryCode(ip);
            res.status(200).send(countryCode);
        }
        catch (err) {
            next(err);
        }
    });
    // if we got here we don't know this route. return 404.
    app.all('*', function (req, res) {
        res.status(404).send('unknown route');
    });
}
/**
 * Middleware to log incoming requests and responses.
 */
function expressLogger(req, res, next) {
    // log the incoming request
    logger_1.log(`Incoming request:`, { path: req.path, query: req.query });
    // hold the original send function.
    const send = res.send;
    // create a new send function that logs the response.
    res.send = function (body) {
        logger_1.log(`Path:'${req.path}' response:`, body);
        return send.call(this, body);
    };
    next();
}
/**
 * Used as an error middleware for express. expects to get a serviceException as the first argument.
 * can fallback to standard javascript Error when required.
 *
 * All arguments are standard express error middleware arguments.
 */
async function errorMiddleware(err, req, res, next) {
    if (err.serviceException) {
        res.status(err.code).send(err.message);
    }
    else {
        const msg = JSON.stringify(err);
        res.status(500).send(msg);
    }
}
/**
 * Initializes express webserver.
 * @returns Promise<void>
 */
function initServer() {
    const app = express_1.default();
    const port = process.env.PORT;
    app.use(expressLogger);
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
/**
 * Shuts down the webserver if it is running.
 */
async function stopServer() {
    if (server) {
        logger_1.log('Web server shutting down');
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
