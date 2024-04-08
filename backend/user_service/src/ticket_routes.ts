import axios, { Axios, AxiosResponse } from "axios";
import { Request, Response } from "express";
import { TICKET_SERVICE, TICKET_LOCK_PATH, TICKET_GET } from "./const.js";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function getTicketArray(dbRes) {
  const eventIDs = dbRes.map((event) => event._id); // Assuming the event ID field is "_id"
  // Create an array of promises to fetch tickets for each event
  const ticketPromises = eventIDs.map((eventID) => {
    return axios.get(`${TICKET_SERVICE}${TICKET_GET}/${eventID}`);
  });
  const responses = await axios.all(ticketPromises);
  // Extract ticket data from responses
  const dbResWithTickets = dbRes.map((event) => {
    let ticketArray = [];
    const response: any = responses.find((res: AxiosResponse) => res.data.eventID === event._id);
    if (response) ticketArray = response.data.ticketArray;
    return { ...event, ticketArray };
  });
  return dbResWithTickets;
}

export async function lockTicketRoute(req: Request, res: Response) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("Not logged in");
    }

    let username;
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      username = (payload as JwtPayload).username;
    } catch (e) {
      return res.status(401).send("Invalid token");
    }
    const ticketResponse: AxiosResponse = await axios.post(`${TICKET_SERVICE}${TICKET_LOCK_PATH}`, {
      payload: { username, ticketId: req.body.ticketId, lockedTickets: req.body.lockedTickets },
    });
    res.status(ticketResponse.status).send(ticketResponse.data);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}
