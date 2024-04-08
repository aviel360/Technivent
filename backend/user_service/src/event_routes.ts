import { Request, Response } from "express";
import { COMMENT_PATH, COMMENT_SERVICE, EVENT_PATH, EVENT_SERVICE} from './const.js'
import axios, { AxiosResponse } from "axios";
import { PublisherChannel } from "./comment_publisher.js";
import { JwtPayload } from "jsonwebtoken";
import jwt from 'jsonwebtoken';
import { UserType } from "./models/user.js";
import { getTicketArray } from "./ticket_routes.js";

export async function getEventRoute(req: Request, res: Response) {
  try {
    const id = req.query.id;
    if (id) {
      return getEventById_user(req, res, id.toString());
    }
    const eventResponse: AxiosResponse = await axios.get(EVENT_SERVICE + EVENT_PATH, { params: req.query });
    const dbRes = await getTicketArray(eventResponse.data.dbRes);
    res.status(eventResponse.status).send({dbRes});
  } catch (error: any) {
    res.status(500).send(error.message);
  }
}

export async function getEventById_user(req: Request, res: Response, id: string) {
  try {
    const [eventResponse, commentsResponse] = await Promise.all([
      axios.get(`${EVENT_SERVICE}${EVENT_PATH}/${id}`),
      axios.get(`${COMMENT_SERVICE}${COMMENT_PATH}?eventID=${id}`)
    ]);

    const dbRes = await getTicketArray([eventResponse.data.dbRes]);
    const data = {
      event: dbRes[0],
      comments: commentsResponse.data
    };
    res.status(200).send(data);
  } catch (error: any) {
    res.status(500).send(error);
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
    const response: AxiosResponse = await axios.post(EVENT_SERVICE + EVENT_PATH, req.body, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    res.status(response.status).send(response.data);
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

  if (userType === UserType.User || userType === UserType.Worker) //only Manager and Admin can update event
  {
    return res.status(403).send("Forbidden: Only Manager and Admin can update event");
  }

  try {
    const response: AxiosResponse = await axios.put(EVENT_SERVICE + EVENT_PATH + '/' + req.params.id, req.body, {
      headers: {
        'Content-Type': 'application/json'
      }
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
    res.status(201).send({ message: 'Comment published' });
  } catch (error) {
    res.status(500).send(error.message);
  }
}