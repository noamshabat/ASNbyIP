"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidRequestException = void 0;
const ServiceException_1 = require("./ServiceException");
class InvalidRequestException extends ServiceException_1.ServiceException {
    constructor(message) {
        super(message, 400);
    }
}
exports.InvalidRequestException = InvalidRequestException;
