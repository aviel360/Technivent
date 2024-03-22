
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import {
    loginRoute,
    logoutRoute,
    signupRoute,
    usernameRoute,
} from './routes.js';

import {
    LOGIN_PATH,
    LOGOUT_PATH,
    SIGNUP_PATH,
    _PATH
} from './const.js';

dotenv.config();

let dbUri;
/* TODO: set the dbUri variable to your atlas connection string */

/* ========== */
await mongoose.connect(dbUri);

const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());
/* TODO: set CORS headers appropriately using the cors middleware */

/* ========== */

app.post(LOGIN_PATH, loginRoute);
app.post(LOGOUT_PATH, logoutRoute);
app.post(SIGNUP_PATH, signupRoute);

app.get(_PATH, usernameRoute);

app.listen(port, () => {
    console.log(`Server running! port ${port}`);
});
