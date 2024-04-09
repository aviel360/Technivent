import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { addTickets, getTicketArrayByEventId, lockTicket, ticketSold, unlockTicket } from "./routes.js";


import { TICKET_ADD, TICKET_BY_EVENT_ID, TICKET_LOCK, TICKET_SOLD, TICKET_UNLOCK } from "./const.js";
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

app.post(TICKET_LOCK, (req, res) => lockTicket(req, res, ticketManager));
app.post(TICKET_UNLOCK, (req, res) => unlockTicket(req, res, ticketManager));
app.get(TICKET_BY_EVENT_ID, getTicketArrayByEventId);
app.post(TICKET_ADD, addTickets);
app.post(TICKET_SOLD, (req, res) => ticketSold(req, res, ticketManager));

app.listen(port, () => {
  console.log(`Ticket Server running! port ${port}`);
});
