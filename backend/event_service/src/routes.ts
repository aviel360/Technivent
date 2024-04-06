import { Request, Response } from "express";
import Event from "./models/event.js";

export async function getEvents(req: Request, res: Response) {
  if(req.query.all) {
    return getAllEvents(req, res);
  }
  
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

export async function getAllEvents(req: Request, res: Response) {
  let dbRes;
  try {  
    dbRes = await Event.find({});
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
  try {
    const id = req.params.id;
    const dbRes = await Event.findOne({ _id: id }); 
    res.status(200).send({ dbRes });
  } catch (error: any) {
    res.status(500).send(error);
  }
}

export async function getEventArrayById(req: Request, res: Response) {
  try {
    const ids = req.params.ids.split(',');
    const dbRes = await Event.find({ _id: {$in: ids} }); 
    res.status(200).send({ dbRes });
  } catch (error: any) {
    res.status(500).send(error);
  }
}
