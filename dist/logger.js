"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
function log(...args) {
    console.log(new Date().toISOString() + "\t\t", ...args);
}
exports.log = log;
