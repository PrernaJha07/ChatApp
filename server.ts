import express, { Request, Response } from "express";
import http from "http";
import mongoose from "mongoose";
import path from "path";
import multer from "multer";
import bcryptjs from "bcryptjs";
import * as dotenv from "dotenv";
import { Server } from "socket.io";
import { IUser, UserModel } from "./models/User";

dotenv.config();

const app = express();
const server = http.createServer(app);      
const io = new Server(server);

mongoose
  .connect(process.env.MONGO_URI as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use(express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer config
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "uploads/");
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

app.post("/register", upload.single("avatar"), async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const hashedPassword = await bcryptjs.hash(password, 10);
  const avatar = req.file ? `/uploads/${req.file.filename}` : null;

  const user: IUser = new UserModel({
    username,
    password: hashedPassword,
    avatar,
  });
 
  await user.save();
  console.log("Saved user:", user); // ✅ Add this line

  res.json({ success: true });
});

app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });

  if (user && await bcryptjs.compare(password, user.password)) {
    res.json({
      success: true,
      user: { username: user.username, avatar: user.avatar },
    });
  } else {
    res.json({ success: false });
  }
});

// Redirect root to login page
app.get("/", (_req: Request, res: Response) => {
  res.redirect("/login.html");
});

interface ChatMessage {
  username: string;
  message: string;
  avatar: string;
  timestamp?: number;
}

let chatHistory: ChatMessage[] = [];

io.on("connection", (socket) => {
  socket.emit("load-messages", chatHistory);

  socket.on("chat-message", (data: ChatMessage) => {
    chatHistory.push(data);
    socket.broadcast.emit("chat-message", data);
  });
});

const PORT = process.env.PORT || 3004;
server.listen(Number(PORT), "0.0.0.0", () => {
 console.log(`Server running locally on http://localhost:${PORT}`);
  console.log(`Use 'ngrok http ${PORT}' to share over the internet`);
});
