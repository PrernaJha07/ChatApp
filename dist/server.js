"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv = __importStar(require("dotenv"));
const socket_io_1 = require("socket.io");
const User_1 = require("./models/User");
dotenv.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
mongoose_1.default
    .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Multer config
const storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, "uploads/");
    },
    filename: function (_req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage });
app.post("/register", upload.single("avatar"), async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const avatar = req.file ? `/uploads/${req.file.filename}` : null;
    const user = new User_1.UserModel({
        username,
        password: hashedPassword,
        avatar,
    });
    await user.save();
    console.log("Saved user:", user); // ✅ Add this line
    res.json({ success: true });
});
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User_1.UserModel.findOne({ username });
    if (user && await bcryptjs_1.default.compare(password, user.password)) {
        res.json({
            success: true,
            user: { username: user.username, avatar: user.avatar },
        });
    }
    else {
        res.json({ success: false });
    }
});
// Redirect root to login page
app.get("/", (_req, res) => {
    res.redirect("/login.html");
});
let chatHistory = [];
io.on("connection", (socket) => {
    socket.emit("load-messages", chatHistory);
    socket.on("chat-message", (data) => {
        chatHistory.push(data);
        socket.broadcast.emit("chat-message", data);
    });
});
const PORT = process.env.PORT || 3004;
server.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Server running locally on http://localhost:${PORT}`);
    console.log(`Use 'ngrok http ${PORT}' to share over the internet`);
});
