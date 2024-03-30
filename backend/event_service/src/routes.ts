import { Request, Response } from "express";
import Event from "./models/event.js";
import axios from "axios";

export async function getEvents(req: Request, res: Response) {
  let dbRes;
  const now = new Date();
  try {
    dbRes = await Event.aggregate([
      {
        $match: { start_date: { $gt: now } }, // Filter events with start_date greater than now
      },
      {
        $addFields: {
          ticketCount: {
            $size: {
              $filter: {
                input: "$ticketArray",
                as: "ticket",
                cond: { $gt: ["$$ticket.available", 0] }, // Filter tickets with available quantity greater than 0
              },
            },
          },
        },
      },
      {
        $match: { ticketCount: { $gt: 0 } }, // Filter events with at least one ticket available
      },
    ]);
    res.status(200).send({ dbRes });
  } catch (error: any) {
    res.status(500).send(error);
  }
}

export async function addEvent(req: Request, res: Response) {
  
    //Authentication and permission check??

    const body = req.body;
    const newEvent = new Event(body);
    try {
      const dbEvent = await newEvent.save();
      res.status(201).send({ eventID: dbEvent._id });
    } catch (error: any) {
      res.status(500).send(error);
    }
}

export async function getEventById(req: Request, res: Response) {
  const id = req.params.id;
  console.log(id);
  try {
    const response = await axios.get(`http://localhost:3001/api/event/${id}`);
    if (response.status === 404) {
      res.status(404).send('Event not found');
      
    } else {
      res.status(200).send(response.data);
    }
  } catch (error: any) {
    res.status(500).send(error);
  }
}
