import { Request, Response } from "express";
import Event from "./models/event.js";

export async function getEvents(req: Request, res: Response) {
  let dbRes;
  const now = new Date();
  try {
    dbRes = await Event.find({ start_date: { $gt: now } });
    res.status(200).send({ dbRes });
  } catch (error: any) {
    res.status(500).send(error);
  }
}
