import { Request, Response } from "express";
import Payment from "./models/payment.js";

export async function getPayments(req: Request, res: Response) {
  let dbRes;
  const username = req.params.username;
  try {
    dbRes = await Payment.aggregate([
      // Match payments based on the specified username
      {
        $match: {
          username: "Aviel",
        },
      },
      // Group payments by eventID
      {
        $group: {
          _id: "$eventID", // Group by eventID
          payments: { $push: "$$ROOT" }, // Store all documents in an array for each eventID
        },
      },
    ]);
    // Send the result with status 200
    res.status(200).send({ dbRes });
  } catch (error: any) {
    // If there's an error, send an error response with status 500
    res.status(500).send(error);
  }
}