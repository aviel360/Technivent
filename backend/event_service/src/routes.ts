import { Request, Response } from "express";
import Event from "./models/event.js";

export async function getEvents(req: Request, res: Response) {
  if(req.query.all) {
    return getAllEvents(req, res);
  }
  
  let dbRes;
  const now = new Date();
  try {
    dbRes = await Event.find({ start_date: { $gt: now } });
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
  
    //Authentication and permission check - done in user service

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


export async function updateEvent(req: Request, res: Response) {
   //Authentication and permission check - done in user service

  const id = req.params.id;
  const body = req.body;
  try {
    const dbRes = await Event.findOne({ _id: id });
    if (!dbRes) {
      return res.status(404).send("Event not found");
    }

    if (new Date(body.start_date) < dbRes.start_date ) {
      return res.status(400).send("Event cannot be rescheduled to an earlier date");
    }
    const updatedEvent = await Event.findOneAndUpdate({ _id: id}, body, { new: true });
    res.status(200).send({ updatedEvent });
  }
  catch (error: any) {
    res.status(500).send(error);
  }
}

