import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Event from "./models/event.js";

import { getEvents, addEvent } from "./routes.js";

import { EVENT_PATH } from "./const.js";
import { EventCategory } from "./models/event.js";

dotenv.config();

let dbUri;
dbUri = `mongodb+srv://edenh:${process.env.DBPASS}@cluster0.cuoqmgf.mongodb.net/Technivent?retryWrites=true&w=majority&appName=Cluster0`;

await mongoose.connect(dbUri);

const port = process.env.PORT || 8081;

const app = express();

app.get(EVENT_PATH, getEvents);
app.post(EVENT_PATH, addEvent);

const ticket1 = {
  name: "Bronze",
  quantity: 1000,
  price: 50,
};

app.listen(port, () => {
  console.log(`Server running! port ${port}`);
});
