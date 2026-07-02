import dotenv from "dotenv";
dotenv.config();

//Socket.io
import http from "http";
import { initializeSocket } from "./socket.js";

import cookieParser from "cookie-parser";
import cors from "cors";

import express from "express";
import morgan from "morgan";
import { errorHandler, routeNotFound } from "./middlewares/errorMiddleware.js";
import routes from "./routes/index.js";
import dbConnection from "./utils/connectDB.js";

dbConnection();

const port = process.env.PORT || 5000;

const app = express();


const allowedOrigins = [
  "http://localhost:5173", // Vite
  "https://sunbeam-cleaning-service.netlify.app",
];
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(morgan("dev"));
app.use("/api", routes);

app.use(routeNotFound);
app.use(errorHandler);


// Socket.io
const server = http.createServer(app);

initializeSocket(server);

server.listen(port, () =>
  console.log(`Server listening on ${port}`)
);
