"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rooms = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    username: String,
    password: String,
    videolink: String,
    rooms: String
});
const rooms = new mongoose_1.default.Schema({
    Owner: String,
    roomid: String,
    url: String,
});
exports.User = mongoose_1.default.model('User', UserSchema);
exports.Rooms = mongoose_1.default.model('Room', rooms);
