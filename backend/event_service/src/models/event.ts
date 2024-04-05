import Joi from "joi";
import * as mongoose from "mongoose";

export const ticketSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        available: {type: Number, required: true, min: 0},
        price: {type: Number, required: true, min: 0},
        totalTickets: {type: Number, required: true, min: 0}
    },
    {
        _id: false,
        versionKey: false
    }
);

export const ticketSchemaJoi = Joi.object({
    name: Joi.string().required(),
    available: Joi.number().min(0).required(),
    price: Joi.number().min(0).required(),
    totalTickets: Joi.number().min(0).required()
  }).strict().unknown();


export enum EventCategory {
    Charity = "Charity Event",
    Concert = "Concert",
    Conference = "Conference",
    Convention = "Convention",
    Exhibition = "Exhibition",
    Festival = "Festival",
    ProductLaunch = "Product Launch",
    Sports = "Sports Event"
}
const RatingSchema = new mongoose.Schema({
    average: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  }, { _id: false });
  

const dateFormatRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

const eventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: false },
        category: { type: String, required: true, enum: Object.values(EventCategory) },
        description: { type: String, required: true },
        organizer: { type: String, required: true },
        start_date: { type: Date, required: true },
        end_date: {
            type: Date,
            required: true,
            validate: {
                validator: function(value) {
                    return value > this.start_date;
                },
                message: "Event's end date must be after its start date."
            }
        },
        location: { type: String, required: true },
        ticketArray: { type: [ticketSchema], required: true },
        image: { type: String },
        rating: { type: RatingSchema, default: { average: 0, total: 0 } },
    }
);

eventSchema.pre('save', function(next) {
    if (this.isModified('start_date')) {
        const startDate = new Date(this.start_date);
        if (isNaN(startDate.getTime())) {
            const err = new Error('Invalid start date format');
            next(err);
            return;
        }
        this.start_date = startDate;
    }
    if (this.isModified('end_date')) {
        const endDate = new Date(this.end_date);
        if (isNaN(endDate.getTime())) {
            const err = new Error('Invalid end date format');
            next(err);
            return;
        }
        this.end_date = endDate;
    }
    next();
});

export default mongoose.model("Event", eventSchema);