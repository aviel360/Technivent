import * as mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    eventID: { type: String, required: true },
    username: { type: String, required: true }, //maybe also userId?
    date: { type: Date, required: true,  default: Date.now},
    commentText: { type: String, required: true },
}, {id: true , versionKey: false});

const Comment = mongoose.model('Final-Project-Comment', commentSchema);

export default Comment;