"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJwt = exports.SECRET = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.SECRET = "Watch-along";
const authenticateJwt = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader;
        jsonwebtoken_1.default.verify(token, exports.SECRET, (err, payload) => {
            if (err) {
                return res.sendStatus(403);
            }
            if (!payload) {
                return res.sendStatus(403);
            }
            if (typeof payload === "string") {
                return res.sendStatus(403);
            }
            req.headers["userId"] = payload.id;
            next();
        });
    }
    else {
        res.sendStatus(401);
    }
};
exports.authenticateJwt = authenticateJwt;