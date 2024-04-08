import { Request, Response } from "express";
import { TicketManager } from "./models/ticketManager.js";
import Ticket from "./models/ticket.js"

export async function lockTicket(req: Request, res: Response, ticketManager: TicketManager) {
  try {
    // Extract necessary data from the request
    const { username, ticketId, lockedTickets } = req.body.payload;
    
    // Call the lockTickets method of TicketManager to lock the tickets
    await ticketManager.lockTickets(username, ticketId, lockedTickets, false);

    // Respond with a success message
    res.status(200).send("Tickets locked successfully");
  } catch (error) {
    // Handle errors
    res.status(500).send(error);
  }
}

export async function getTicketArrayByEventId(req: Request, res: Response) {
  try {
    const id = req.params.id
    const ticketArray = await Ticket.find({ eventID: id });
    res.status(200).send({ eventID:id, ticketArray });
  } catch (error: any) {
    res.status(500).send(error);
  }
}
