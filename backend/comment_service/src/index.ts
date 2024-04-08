import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { COMMENT_PATH } from "./const.js";
import { getComments, addComment } from "./routes.js";
import { consumeMessages } from "./consume_messeges.js";


dotenv.config();

let dbUri;
dbUri = `mongodb+srv://edenh:${process.env.DBPASS}@cluster0.cuoqmgf.mongodb.net/Technivent?retryWrites=true&w=majority&appName=Cluster0`;

await mongoose.connect(dbUri);

const port = process.env.PORT || 3002;

const app = express();
app.use(express.json());

app.get(COMMENT_PATH, getComments);
app.post(COMMENT_PATH, addComment);

consumeMessages();

app.listen(port, () => {
  console.log(`Comment Server running! port ${port}`);
});
