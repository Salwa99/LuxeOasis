import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';

mongoose
  .connect("mongodb://localhost/luxeOasis")
  .then(() => console.log("connected to database"))
  .catch((err) => console.log(`Error ${err}`));

const app = express();

app.use(express.json());

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server is running in port ${PORT}`)
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

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