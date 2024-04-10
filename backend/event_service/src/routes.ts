import e, { Request, Response } from "express";
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

export async function deleteEvent(req: Request, res: Response) {

  const eventId = req.params.eventID;

  try {
    // Find the event by ID and delete it
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // If the event is successfully deleted, return a success response
    res.status(200).send('Event deleted successfully');
  } catch (error) {
    // If an error occurs during the deletion process, return a 500 status code
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


export async function updateRating(message) {
  const id = message.eventId;
  const oldRating = Number(message.oldRating);
  const newRating = Number(message.newRating);
 
  try {
    const dbRes = await Event.findOne
    ({ _id: id });
    if (!dbRes) {
      console.error(`Event ${id} not found`);
      return;
    }

    // Calculate new average rating
    
    let totalRaters = dbRes.rating.total;
  
    const newAverage = oldRating === 0 
      ? (dbRes.rating.average * totalRaters + newRating) / (totalRaters + 1)
      : (dbRes.rating.average * totalRaters - oldRating + newRating) / totalRaters;

          // Update rating
    await Event.updateOne(
      { _id: id },
      {
        $inc: { "rating.total": oldRating === 0 ? 1 : 0 },
        $set: { "rating.average": newAverage }
      }
    );

    console.log(`Rating event ${id}. New average: ${newAverage}`);
  } catch (error) {
    console.error('Error updating rating:', error);
  }
}