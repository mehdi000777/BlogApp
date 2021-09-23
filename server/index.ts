import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import authRouter from './routes/authRoutes';
import userRouter from './routes/userRoutes';
import categoryRouter from './routes/categoryRoutes';
import blogRouter from './routes/blogRouter';
import commentRouter from './routes/commentRouters';
import { createServer } from 'http';
import { Socket, Server } from 'socket.io';
import path from 'path';


// Middelware
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());


// Socket
const http = createServer(app);
export const io = new Server(http);
import { socketServer } from './config/socket';

io.on("connection", (socket: Socket) => socketServer(socket));

// Routes
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", categoryRouter);
app.use("/api", blogRouter);
app.use("/api", commentRouter);


// Database
import "./config/database";


// Production Deploy
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client', 'build', 'index.html'))
    })
}


// Listener
const port = process.env.PORT || 5000;
http.listen(port, () => {
    console.log(`http://localhost:${port}`);
})