import axios, { AxiosResponse } from "axios";
import { Request, Response } from "express";
import { EVENT_SERVICE, EVENT_PATH, PAYMENT_SERVICE, PAYMENT_PATH } from "./const.js";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function getPayments(req: Request, res: Response) {
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

    const paymentResponse: AxiosResponse = await axios.get(`${PAYMENT_SERVICE}${PAYMENT_PATH}/${username}`);
    const payments = paymentResponse.data.dbRes;
    const ids = payments.map((payment) => payment._id);
    console.log(`${EVENT_SERVICE}${EVENT_PATH}/${ids}`)
    const eventResponse: AxiosResponse = await axios.get(`${EVENT_SERVICE}${EVENT_PATH}?ids=${ids}`);
    const events = eventResponse.data.dbRes;

    const mergedData = payments.flatMap((paymentEvent) => {
      const eventID = paymentEvent._id;
      const payments = paymentEvent.payments;
      return payments.map((payment) => {
        const event = events.find((event) => event._id === eventID);
        return {
          ...payment,
          event: event,
        };
      });
    });

    res.status(paymentResponse.status).send(mergedData);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}
