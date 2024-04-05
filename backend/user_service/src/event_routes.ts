import { Request, Response, response } from "express";
import { COMMENT_PATH, COMMENT_SERVICE, EVENT_PATH, EVENT_SERVICE} from "./const.js";
import axios, { AxiosResponse } from "axios";
import { PublisherChannel } from "./publisher_channel.js";


export async function getEventRoute(req: Request, res: Response) {
  try {
    const id = req.query.id;
    if (id) {
      return getEventById_user(req, res, id.toString());
    }
    const response: AxiosResponse = await axios.get(EVENT_SERVICE + EVENT_PATH, { params: req.query });
    res.status(response.status).send(response.data);
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

    const data = {
      event: eventResponse.data,
      comments: commentsResponse.data
    };

    res.status(200).send(data);
  } catch (error: any) {
    res.status(500).send(error);
  }
}


export async function addComment(req: Request, res: Response, publisherChannel: PublisherChannel) {
  try {
    await publisherChannel.sendEvent(JSON.stringify(req.body));
    res.status(201).send({ message: 'Comment published' });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export async function addEventRoute(req: Request, res: Response) {
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