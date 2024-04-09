import * as mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  eventID: {type: String, required: true},
  name: { type: String, required: true },
  available: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  totalTickets: { type: Number, required: true, min: 0 },
});

export default mongoose.model("Ticket", ticketSchema);
