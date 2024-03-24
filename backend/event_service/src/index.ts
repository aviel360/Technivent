
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import {
    getEvent,
} from './routes.js';

import {
    EVENT_PATH
} from './const.js';

dotenv.config();

let dbUri;
dbUri = `mongodb+srv://edenh:${process.env.DBPASS}@cluster0.cuoqmgf.mongodb.net/Technivent?retryWrites=true&w=majority&appName=Cluster0`;

await mongoose.connect(dbUri);

const port = process.env.PORT || 8081;

const app = express();

app.get(EVENT_PATH, getEvent);

app.listen(port, () => {
    console.log(`Server running! port ${port}`);
});
