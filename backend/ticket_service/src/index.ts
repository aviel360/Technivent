import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { lockTicket } from "./routes.js";


import { TICKET_LOCK } from "./const.js";
import { TicketManager } from "./models/ticketManager.js";

dotenv.config();

let dbUri;
dbUri = `mongodb+srv://edenh:${process.env.DBPASS}@cluster0.cuoqmgf.mongodb.net/Technivent?retryWrites=true&w=majority&appName=Cluster0`;

await mongoose.connect(dbUri);

const port = process.env.PORT || 8083;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ticketManager = new TicketManager();

app.post(TICKET_LOCK, lockTicket(ticketManager));

app.listen(port, () => {
  console.log(`Server running! port ${port}`);
});
