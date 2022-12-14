import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoute from "./routes/auth.js";
import hotelsRoute from "./routes/hotels.js";
import usersRoute from "./routes/users.js";
import roomsRoute from "./routes/rooms.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to mongoDB");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

mongoose.connection.on("connected", () => {
  console.log("mongoDB connected!");
});

// middlewares

// Enable All CORS Requests
// origin: true로 설정함으로써 req.header('Origin') 출처를 허용
// credentials: true로 설정함으로써 CORS header를 구성
// Credentials란 쿠키, 인증헤더, TLS client certificates(증명서)를 말함
app.use(cors({ origin: true, credentials: true }));

app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoute);
app.use("/hotels", hotelsRoute);
app.use("/users", usersRoute);
app.use("/rooms", roomsRoute);

app.use((err, req, res, next) => {
  console.log("error middleware...");
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  console.log("err.status: ", err.status);
  console.log("err.message: ", err.message);

  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(8800, () => {
  connect();
  console.log("Connected to backend.");
});
