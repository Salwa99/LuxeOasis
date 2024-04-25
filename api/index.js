import express from 'express';
import mongoose from 'mongoose';

mongoose
  .connect("mongodb://localhost/luxeOasis")
  .then(() => console.log("connected to database"))
  .catch((err) => console.log(`Error ${err}`));

const app = express();

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server is running in port ${PORT}`)
})