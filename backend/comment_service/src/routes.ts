import { Request, Response } from "express";
import Comment from "./models/comment.js";
import { SkipDefault, LimitDefault } from "./const.js";

export const getComments = async (req: Request, res: Response) => {
    let dbRes;

    let skipParam = Number(req.query.skip);
    let limitParam = Number(req.query.limit);

    let skip = (!isNaN(skipParam) && skipParam >= 0) ? skipParam : SkipDefault;
    let limit = (!isNaN(limitParam) && limitParam > 0) ? Math.min(limitParam, LimitDefault) : LimitDefault;
    try{
        dbRes = await Comment.find().skip(skip).limit(limit);
        res.status(200).send(dbRes);
    }
    catch (error: any) {
        res.status(500).send(error);
    }

};

export const addComment = async (req: Request, res: Response) => {
    //Authentication and permission check??

    const body = req.body;
    const newComment = new Comment(body);
    try {
        const dbComment = await newComment.save();
        res.status(201).send({ commentID: dbComment._id });
    } catch (error: any) {
        res.status(500).send(error);
    }
};