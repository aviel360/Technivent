import { Request, Response } from "express";
import { COMMENT_PATH, COMMENT_SERVICE, EVENT_PATH, EVENT_RATING, EVENT_SERVICE, TICKET_ADD, TICKET_SERVICE } from "./const.js";
import axios, { AxiosResponse } from "axios";
import { PublisherChannel } from "./comment_publisher.js";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { User, UserType } from "./models/user.js";
import { getTicketArray } from "./ticket_routes.js";
import { RatingPublisherChannel } from "./rating_publisher.js";

export async function getEventRoute(req: Request, res: Response) {
  try {
    const id = req.query.id;
    if (id) {
      return getEventById_user(req, res, id.toString());
    }
    const eventResponse: AxiosResponse = await axios.get(EVENT_SERVICE + EVENT_PATH, { params: req.query });
    let dbRes = await getTicketArray(eventResponse.data.dbRes);

    res.status(eventResponse.status).send({ dbRes });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}

export async function getEventById_user(req: Request, res: Response, id: string) {
  try {
    const [eventResponse, commentsResponse] = await Promise.all([
      axios.get(`${EVENT_SERVICE}${EVENT_PATH}/${id}`),
      axios.get(`${COMMENT_SERVICE}${COMMENT_PATH}?eventID=${id}`),
    ]);

    const dbRes = await getTicketArray([eventResponse.data.dbRes]);
    const data = {
      event: dbRes[0],
      comments: commentsResponse.data,
    };
    res.status(200).send(data);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}

export async function addEventRoute(req: Request, res: Response) {
  const token = req.cookies.token;
  if (!token) {
  }

  let userType;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    userType = (payload as JwtPayload).userType;
  } catch (e) {
    return res.status(401).send("Invalid token");
  }

  if (userType === userType.User) {
    return res.status(403).send("Forbidden");
  }
  try {
    console.log(req.body);
    const eventResponse = await axios.post(EVENT_SERVICE + EVENT_PATH, req.body.event, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    try
    {
      const payload = {ticketArray: req.body.ticketArray, eventID: eventResponse.data.eventID }
      axios.post(`${TICKET_SERVICE}${TICKET_ADD}`, payload);
    }
    catch(error: any)
    {
      await axios.delete(`${EVENT_SERVICE}${EVENT_PATH}/${eventResponse.data.eventID}`);
      throw error;
    }
    
    res.status(200).send("Event created successfully");
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}

export async function updateEventRoute(req: Request, res: Response) {
  const token = req.cookies.token;
  if (!token) {
  }

  let userType;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    userType = (payload as JwtPayload).userType;
  } catch (e) {
    return res.status(401).send("Invalid token");
  }

  if (userType === UserType.User || userType === UserType.Worker) {
    //only Manager and Admin can update event
    return res.status(403).send("Forbidden: Only Manager and Admin can update event");
  }

  try {
    const response: AxiosResponse = await axios.put(EVENT_SERVICE + EVENT_PATH + "/" + req.params.id, req.body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    res.status(response.status).send(response.data);
  } catch (error: any) {
    res.status(500).send(error.response.data);
  }
}

//Comment routes
export async function addComment(req: Request, res: Response, publisherChannel: PublisherChannel) {
  try {
    await publisherChannel.sendEvent(JSON.stringify(req.body));
    res.status(201).send({ message: "Comment published" });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

//Rating routes
export async function editRating(req: Request, res: Response, publisherChannel: RatingPublisherChannel) {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).send("Not logged in");
    return;
  }
  let username;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    username = (payload as JwtPayload).username;
  } catch (e) {
    return res.status(401).send("Invalid token");
  }

  const user = await User.findOne({ username: username });
  if (!user) {
    res.status(404).send("User not found");
    return;
  }
  
  const eventId = req.body.id;
  const newRating = req.body.rating;

  let oldRating = 0;
  const existingRating = user.NumOfRatings.find(rating => rating.eventID === eventId);
  if (existingRating) {
    oldRating = existingRating.rating;
    await User.updateOne(
      { "username": username, "NumOfRatings.eventID": eventId },
      { $set: { "NumOfRatings.$.rating": newRating } }
    );
  }

  if (!user.NumOfRatings.some(rating => rating.eventID === eventId)) {
    await User.updateOne({ username: username }, { $push: { NumOfRatings: { eventID: eventId, rating: newRating } } });
  }

  try {
    const payload = { eventId, oldRating, newRating };

    await publisherChannel.sendEvent(JSON.stringify(payload));
    res.status(201).send({ message: "Rating published" });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}
