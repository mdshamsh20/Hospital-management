"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};
exports.sendSuccess = sendSuccess;
const sendError = (res, message = 'Error', errorCode = 'INTERNAL_ERROR', statusCode = 500, details = []) => {
    res.status(statusCode).json({
        success: false,
        errorCode,
        message,
        details,
    });
};
exports.sendError = sendError;
