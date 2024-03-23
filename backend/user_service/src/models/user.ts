
import * as mongoose from 'mongoose';

export enum UserType {
    User = "User",
    Admin = "Admin",
    Manager = "Manger",
    Worker = "Worker"
}

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }, 
    userType: { type: String, enum: Object.values(UserType), default: UserType.User },
    secretQuestion: { type: String, required: true },
    secretAnswer: { type: String, required: true },
    eventArray: { type: Array, default: []}, //TODO: decide what to keep in this array (eventID, all event...)
    NumOfRatings: { type: Number, default: 0},
}, {id: true , versionKey: false});

export const loginSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model('Final-Project-User', userSchema);
const LoginUser = mongoose.model('LoginUser', loginSchema);

export { User, LoginUser };
