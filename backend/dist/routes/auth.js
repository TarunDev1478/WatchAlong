"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("../db/db");
const db_2 = require("../db/db");
const authenticate_1 = require("../middleware/authenticate");
const router = express_1.default.Router();
const signinput = zod_1.z.object({
    username: zod_1.z.string(),
    password: zod_1.z.string()
});
router.use((0, cors_1.default)());
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let parsedInput = signinput.safeParse(req.body);
    if (!parsedInput.success) {
        return res.json({
            error: "Wrong input",
        });
    }
    const username = req.body.username;
    const password = req.body.password;
    const user = yield db_1.User.findOne({ username: req.body.username });
    if (user) {
        res.json({
            message: "User With this username already exist"
        });
    }
    else {
        const newuser = new db_1.User({ username, password });
        yield newuser.save();
        const token = jsonwebtoken_1.default.sign({ id: newuser._id }, authenticate_1.SECRET, { expiresIn: '1h' });
        res.json({ message: 'user created successfully', token });
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield db_1.User.findOne({ username, password });
    if (user) {
        const token = jsonwebtoken_1.default.sign({ id: user._id }, authenticate_1.SECRET, { expiresIn: '1h' });
        res.json({
            message: 'User Logined Successfully', token
        });
    }
    else {
        res.json({
            message: "User Does not exist"
        });
    }
}));
router.post('/addroom', authenticate_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomid, url } = req.body;
    var owner;
    const id = req.headers['userId'];
    const user = yield db_1.User.findOne({ _id: id });
    if (user) {
        user.rooms = roomid;
        yield user.save();
        owner = user._id;
        const newroom = new db_2.Rooms({ Owner: owner, roomid: roomid, url: url });
        yield newroom.save();
        res.json({ message: 'Room created successfully' });
    }
    else {
        res.json({ message: 'You are not authrised' });
    }
}));
router.post('/closeroom', authenticate_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.headers['userId'];
    const user = yield db_1.User.findOne({ _id: id });
    if (user) {
        yield db_2.Rooms.deleteOne({ roomid: user.rooms });
        user.rooms = null;
        user.save();
        res.json({ message: 'Room created successfully' });
    }
    else {
        res.json({ message: 'You are not authrised' });
    }
}));
router.post('/update', authenticate_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.headers['userId'];
        const user = yield db_1.User.findOne({ _id: id });
        if (user) {
            const { url } = req.body;
            user.videolink = url;
            yield user.save();
            return res.status(200).json({ message: 'Video link updated successfully' });
        }
        else {
            return res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        console.error('Error updating video link:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}));
router.get('/geturl', authenticate_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.headers["userId"];
        const user = yield db_1.User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ videolink: user.videolink });
    }
    catch (error) {
        console.error('Error fetching URL:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}));
router.get('/getme', authenticate_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.headers["userId"];
    const user = yield db_1.User.findOne({ _id: id });
    if (user) {
        res.json({ username: user.username });
    }
    else {
        res.status(403).json({ message: "User not autherised to acces this page" });
    }
}));
exports.default = router;
