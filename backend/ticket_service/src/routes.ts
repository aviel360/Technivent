import { Request, Response } from "express";
import { TicketManager } from "./models/ticketManager.js";
import Ticket from "./models/ticket.js"

export async function lockTicket(req: Request, res: Response, ticketManager: TicketManager) {
  try {
    // Extract necessary data from the request
    const { username, ticketId, lockedTickets, flag } = req.body.payload;
    // Call the lockTickets method of TicketManager to lock the tickets
    const purchaseFlag = flag === "true" ? true : false;
    await ticketManager.lockTickets(username, ticketId, lockedTickets, purchaseFlag);

    // Respond with a success message
    res.status(200).send("Tickets locked successfully");
  } catch (error) {
    // Handle errors
    console.log(error.message);
    res.status(500).send(error);
  }
}

export async function unlockTicket(req: Request, res: Response, ticketManager: TicketManager) {
  try {
    // Extract the username from the request
    const { username } = req.body.payload;

    // Call the unlockTickets method of TicketManager to unlock the tickets
    await ticketManager.unlockTickets(username);

    // Respond with a success message
    res.status(200).send("Tickets unlocked successfully");
  } catch (error) {
    // Handle errors
    res.status(500).send(error);
  }
}

export async function ticketSold(req: Request, res: Response, ticketManager: TicketManager) {
  try {
    const { username} = req.body.payload;

    // mark the tickets as sold
    await ticketManager.deleteLockedTickets(username);
    res.status(200).send("Tickets marked as sold successfully");
  } catch (error) {
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
