const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://192.168.31.203:5173",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://172.30.80.1:5173",
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
  },
});

app.use(
  cors({
    origin: allowedOrigins,

    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

connectDB();

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

app.use("/api", require("./routes/index"));

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
