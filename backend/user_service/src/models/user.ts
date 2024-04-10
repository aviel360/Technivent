
import * as mongoose from 'mongoose';

export enum UserType {
    User = "User",
    Admin = "Admin",
    Manager = "Manager",
    Worker = "Worker"
}

export const userEventsSchema = new mongoose.Schema(
    {
        eventID: { type: String, required: true },
        eventName: { type: String, required: true },
        eventStartDate: { type: Date, required: true }
    },
    {
        _id: false,
        versionKey: false
    }
);

export const userRatingsSchema = new mongoose.Schema(
    {
        eventID: { type: String, required: true },
        rating: { type: Number, required: true }
    },
    {
        _id: false,
        versionKey: false
    }
);

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }, 
    userType: { type: String, enum: Object.values(UserType), default: UserType.User },
    secretQuestion: { type: String, required: true },
    secretAnswer: { type: String, required: true },
    eventArray: { type: [userEventsSchema], default: []}, 
    NumOfRatings: { type: [userRatingsSchema], default: [] },
}, {id: true , versionKey: false});

export const loginSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model('Final-Project-User', userSchema);
const LoginUser = mongoose.model('LoginUser', loginSchema);

export { User, LoginUser };
