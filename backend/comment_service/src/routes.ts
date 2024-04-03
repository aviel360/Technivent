import { Request, Response } from "express";
import Comment from "./models/comment.js";
import { SkipDefault, LimitDefault } from "./const.js";

export const getComments = async (req: Request, res: Response) => {
    let dbRes;

    let skipParam = Number(req.query.skip);
    let limitParam = Number(req.query.limit);
    let eventId = req?.query?.eventID?.toString();

    let skip = (!isNaN(skipParam) && skipParam >= 0) ? skipParam : SkipDefault;
    let limit = (!isNaN(limitParam) && limitParam > 0) ? Math.min(limitParam, LimitDefault) : LimitDefault;
    try{
        if (!eventId) {
            res.status(400).send({ error: 'Event ID wasnt passed' });
            return;
        }
        dbRes = await Comment.find({ eventID: eventId }).skip(skip).limit(limit);
        res.status(200).send(dbRes);
    }
    catch (error: any) {
        res.status(500).send(error);
    }

};

export const addComment = async (req: Request, res: Response) => {

    const body = req.body;
    const newComment = new Comment(body);
    try {
        const dbComment = await newComment.save();
        res.status(201).send({ commentID: dbComment._id });
    } catch (error: any) {
        res.status(500).send(error);
    }
};

export const addCommentFromBroker = async (message) => {
    try {
        const body = {
            commentText: message.comment,
            eventID: message.eventId,
            username: message.username,
            date: message.date
          };
        const newComment = new Comment(body);
        const dbComment = await newComment.save();
        console.log(`Comment added: ${dbComment._id}`);
    } catch (error) {
      console.error('Error in addCommentFromBroker:', error);
    }
  };