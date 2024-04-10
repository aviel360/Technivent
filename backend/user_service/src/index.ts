import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { getUserClosestEvent, loginRoute, logoutRoute, resetPasswordRoute, secretQuestionRoute, signupRoute, updateEventsArray, updatePermissionRoute, userRoute } from "./user_routes.js";
import { getEventRoute, addComment, addEventRoute, updateEventRoute } from "./event_routes.js";
import { PublisherChannel } from "./comment_publisher.js";
import { LOGIN_PATH, LOGOUT_PATH, SIGNUP_PATH, EVENT_PATH, SECRET_QUESTION_PATH, PASSWORD_RESET, USER_PATH, COMMENT_PATH, PAYMENT_PATH, EVENT_BY_ID, TICKET_LOCK_PATH, PERMMISION_PATH, USER_EVENTS_PATH } from "./const.js";
import { CreatePayment_User, getPayments } from "./payment_routes.js";
import { lockTicketRoute } from "./ticket_routes.js";
import {consumePaymentMessages} from "./consume_payments_user.js";

dotenv.config();

let dbUri;
dbUri = `mongodb+srv://edenh:${process.env.DBPASS}@cluster0.cuoqmgf.mongodb.net/Technivent?retryWrites=true&w=majority&appName=Cluster0`;

await mongoose.connect(dbUri);

const port = process.env.PORT || 3000;
const origin = process.env.NODE_ENV === "production" ? "https://aviel360.github.io" : 'http://localhost:5173';
const app = express();
const publisherChannel = new PublisherChannel();


app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);


app.put(LOGOUT_PATH, logoutRoute);
app.use(express.urlencoded({ extended: true }));

consumePaymentMessages();

app.get(USER_PATH, userRoute);
app.post(LOGIN_PATH, loginRoute);
app.post(SIGNUP_PATH, signupRoute);
app.post(PASSWORD_RESET, resetPasswordRoute);
app.post(SECRET_QUESTION_PATH, secretQuestionRoute);
app.put(PERMMISION_PATH, updatePermissionRoute);
app.put(USER_EVENTS_PATH, updateEventsArray);
app.get(USER_EVENTS_PATH, getUserClosestEvent);

app.get(EVENT_PATH, getEventRoute);
app.post(EVENT_PATH, addEventRoute);
app.put(EVENT_BY_ID, updateEventRoute);

app.post(COMMENT_PATH, (req, res) => addComment(req, res, publisherChannel));

app.post(TICKET_LOCK_PATH, lockTicketRoute);

app.get(PAYMENT_PATH, getPayments);
app.post(PAYMENT_PATH, CreatePayment_User);


app.listen(port, () => {
  console.log(`User Server running! port ${port}`);
});
