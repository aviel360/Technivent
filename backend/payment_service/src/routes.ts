import { Request, Response } from "express";
import Payment from "./models/payment.js";
import axios from "axios";
import { PaymentPublisherChannel } from "./payment_publisher.js";
import { EVENT_TICKETS } from "../../event_service/src/const.js";
import { HAMMERHEAD_API } from "./const.js";
import {TICKET_BY_EVENT_ID} from "../../ticket_service/src/const.js";
import {TICKET_LOCK} from "../../ticket_service/src/const.js";

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
  //check if the tickets are available to purchease using the ticket service lockTicket 
  try {
    const response = await axios.post(TICKET_LOCK, {
      username,
      ticketId,
      lockedTickets: quantity,
      purchaseFlag: true
    });
    if(response.status != 200){
      return res.status(500).send("Tickets are not available");
    }
  } catch (error: any) {
    res.status(500).send("Tickets are not available");
    return;
  }

  //send CC details to payment hammerhead api
  const totalPrice = quantity * ticketPrice;
  const publisherChannel = new PaymentPublisherChannel();

  const paymentResponse = await axios.post(HAMMERHEAD_API, { creditCardNum, holder, cvv, expDate, totalPrice });
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
      //send success msg to ticket_service and user_service to unlock the tickets (msgBroker)
      await publisherChannel.sendEvent(JSON.stringify({ status: true, username, ticketId, quantity, transactionId}));

      res.status(200).send({ transactionId });
      return;
    } catch (error: any) {
      res.status(500).send(error); 
      return;
    }
  }
  else{
    //send fail msg to ticket_service and user_service to unlock the tickets (msgBroker)
    await publisherChannel.sendEvent(JSON.stringify({ status: false, username, ticketId, quantity}));
    res.status(500).send("Payment failed");
    return;
  }
}


