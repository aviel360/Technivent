import { Request, Response } from "express";
import Payment from "./models/payment.js";
import axios from "axios";

export async function getPayments(req: Request, res: Response) {
  let dbRes;
  const username = req.params.username;
  try {
    dbRes = await Payment.aggregate([
      // Match payments based on the specified username
      {
        $match: {
          username: username,
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

export async function CreatePayment(req: Request, res: Response) {
  const {username, eventID, creditCardNum, holder, cvv, expDate, ticketId, ticketName, ticketPrice, quantity } = req.body;

  //Check if tickets are still available in the moment of payment

  //check if the tickets are still locked

  //send CC details to payment hammerhead api
  const totalPrice = quantity * ticketPrice;
  const paymentResponse = await axios.post('http://localhost:3000/payment', { creditCardNum, holder, cvv, expDate, totalPrice });
  if(paymentResponse.status == 200){
    const transactionId = paymentResponse.data; //should we store it in db or just return it to show in suceess page?
    const paymentData = {
      eventID,
      username,
      date: new Date(),
      ticketId,
      totalPrice
    };
    const payment = new Payment(paymentData);
    try {
      await payment.save();
      //send success msg to ticket service to unlock the tickets (msgBroker)

      res.status(200).send({ transactionId });
    } catch (error: any) {
      res.status(500).send(error); 
    }
  }
  else{
    //send fail msg to ticket service to unlock the tickets (msgBroker)
    res.status(500).send("Payment failed");
  }
}
