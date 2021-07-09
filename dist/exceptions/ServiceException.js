"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceException = void 0;
// All service exceptions are expected to inherit this exception.
// this exception mandates adding name and code to the exception - and helps with generic handling.
class ServiceException extends Error {
    constructor(message, code) {
        super(message);
        this.serviceException = true;
        this.name = this.constructor.name;
        this.code = code;
    }
}
exports.ServiceException = ServiceException;
