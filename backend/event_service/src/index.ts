import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { getEvents, addEvent, getEventById, getEventArrayById, updateEvent} from "./routes.js";


import { EVENT_BY_ID, EVENT_BY_ID_ARRAY, EVENT_PATH, EVENT_TICKETS } from "./const.js";

dotenv.config();

let dbUri;
dbUri = `mongodb+srv://edenh:${process.env.DBPASS}@cluster0.cuoqmgf.mongodb.net/Technivent?retryWrites=true&w=majority&appName=Cluster0`;

await mongoose.connect(dbUri);

const port = process.env.PORT || 8081;


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(EVENT_BY_ID, getEventById);
app.get(EVENT_BY_ID_ARRAY, getEventArrayById);
app.get(EVENT_PATH, getEvents);
app.post(EVENT_PATH, addEvent);
app.put(EVENT_BY_ID, updateEvent);

app.listen(port, () => {
  console.log(`Server running! port ${port}`);
});
