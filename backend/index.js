const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const http = require("http");
const connectDB = require("./config/db");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const path = require("path");
const { initSocket } = require("./socket"); 

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://192.168.31.203:5173",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://172.30.80.1:5173",
];

// 1. Setup Middlewares
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// 2. Initialize Socket.IO
const io = initSocket(server, allowedOrigins);

// 3. Routes
app.use("/api", require("./routes/index"));

app.get('/test-broadcast', (req, res) => {
  // We can use io directly here or getIO() from the socket file
  io.emit('receive_message', { _id: 'test', text: 'Broadcast test', senderId: 'system' });
  res.json({ message: 'Test broadcast sent' });
});

// 4. Database & Start
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});