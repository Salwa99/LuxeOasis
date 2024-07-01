import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import listingRouter from './routes/listing.route.js';

dotenv.config();

mongoose
  .connect("mongodb://localhost/luxeOasis")
  .then(() => console.log("connected to database"))
  .catch((err) => console.log(`Error ${err}`));

const app = express();

app.use(express.json());

app.use(cookieParser());

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server is running in port ${PORT}`)
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter)
app.use("/api/listing", listingRouter);

// Middleware for error message
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
})