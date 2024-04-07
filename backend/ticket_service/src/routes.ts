import { Request, Response } from "express";
import { TicketManager } from "./models/ticketManager.js";

export function lockTicket(ticketManager: TicketManager) {
  return async function(req: Request, res: Response)
  {
    try {
      // Extract necessary data from the request
      const {username, ticketId, lockedTickets } = req.body;
  
      // Call the lockTickets method of TicketManager to lock the tickets
      await ticketManager.lockTickets(username, ticketId, lockedTickets, false);
  
      // Respond with a success message
      res.status(200).send('Tickets locked successfully');
    } catch (error) {
      // Handle errors
      res.status(500).send(error.message);
    }
  }
}

