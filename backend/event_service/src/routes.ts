import { Request, Response } from "express";
import Event from "./models/event.js";

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
