import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import { CreatePayment, getPayments } from "./routes.js";


import { PAYMENT_BY_USER, PAYMENT_ROUTE } from "./const.js";

dotenv.config();

let dbUri;
dbUri = `mongodb+srv://edenh:${process.env.DBPASS}@cluster0.cuoqmgf.mongodb.net/Technivent?retryWrites=true&w=majority&appName=Cluster0`;

await mongoose.connect(dbUri);

const port = process.env.PORT || 8083;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(PAYMENT_BY_USER, getPayments);
app.post(PAYMENT_ROUTE, CreatePayment);

app.listen(port, () => {
  console.log(`Server running! port ${port}`);
});
