import { Request, Response } from "express";
import { EVENT_PATH, EVENT_SERVICE, COMMENT_SERVICE, COMMENT_PATH} from "./const.js";
import axios, { AxiosResponse } from "axios";

export async function getEventRoute(req: Request, res: Response) {
  try {
    const id = req.query.id;
    if (id) {
      return getEventById_user(req, res, id.toString());
    }
    const response: AxiosResponse = await axios.get(EVENT_SERVICE + EVENT_PATH);
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