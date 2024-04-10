import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User, LoginUser, UserType } from "./models/user.js";
import Joi from "joi";

// Route for login
export async function loginRoute(req: Request, res: Response) {
  const credentials = req.body;

  const loginUser = new LoginUser(credentials);
  const validationError = loginUser.validateSync();
  if (validationError) {
    res.status(400).send("Invalid credentials");
    return;
  }

  let user;

  try {
    user = await User.findOne({ username: credentials.username });
  } catch (e) {
    res.status(500).send("Internal server error");
    return;
  }

  if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
    res.status(401).send("Invalid credentials");
    return;
  }

  const token = jwt.sign({ username: user.username, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: "2d" });
  const secure = process.env.NODE_ENV === "production";
  const sameSite = process.env.NODE_ENV === "production" ? "none" : false; 

  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 2);

  res.cookie("token", token, {
    httpOnly: true,
    secure,
    sameSite,
    expires: expirationDate,
  });
  res.status(200).send("Logged in successfully");
}

// Route for logout
export async function logoutRoute(req: Request, res: Response) {
  const secure = process.env.NODE_ENV === "production";
  const sameSite = process.env.NODE_ENV === "production" ? "none" : false;
  // clear the token cookie - should specify the same attributes of the setting
  res.clearCookie("token", {
    httpOnly: true,
    secure,
    sameSite,
  });

  res.status(200).send("Logged out successfully");
}

// Route for signup
export async function signupRoute(req: Request, res: Response) {
  const user = new User(req.body);
  try {
    const error = await user.validate();
  } catch (e) {
    const errorPath = e.message.split(":")[1].trim();
    res.status(400).send("Invalid credentials: " + errorPath);
    return;
  }
  if (await User.exists({ username: user.username })) {
    res.status(400).send("Username already exists");
    return;
  }

  user.password = await bcrypt.hash(user.password, 10);
  user.secretAnswer = await bcrypt.hash(user.secretAnswer, 10);

  try {
    await user.save();
  } catch (e) {
    res.status(500).send("Error creating user");
    return;
  }

  res.status(201).send("User created successfully");
}

// Route for getting user data
export async function userRoute(req: Request, res: Response) {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).send("Not logged in");
    return;
  }

  let username, userType;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    username = (payload as JwtPayload).username;
    userType = (payload as JwtPayload).userType;
  } catch (e) {
    return res.status(401).send("Invalid token");
  }

  let user;

  try {
    user = await User.findOne({ username });
  } catch (e) {
    res.status(500).send("Internal server error");
    return;
  }

  if (!user) {
    res.status(401).send("Invalid credentials");
    return;
  }

  if(user.userType !== userType)
  {
    const new_token = jwt.sign({ username: user.username, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: "2d" });
    const secure = process.env.NODE_ENV === "production";
    const sameSite = process.env.NODE_ENV === "production" ? "none" : false; // TODO ????
  
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 2);
  
    res.cookie("token", new_token, {
      httpOnly: true,
      secure,
      sameSite,
      expires: expirationDate,
    });
  }
  res.status(200).send({ username, userType:user.userType });
}

// Route for getting secret question
export async function secretQuestionRoute(req: Request, res: Response) {
  const usernameSchema = Joi.object({
    username: Joi.string().min(1).required(),
  });

  const { error, value } = usernameSchema.validate(req.body);

  if (error) {
    return res.status(400).send("Bad Request");
  }

  let user;
  try {
    user = await User.findOne({ username: value.username });
    if (user) return res.status(200).send(user.secretQuestion);
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
  res.status(500).send("User doesn't exist");
}

// Route for password reset
export async function resetPasswordRoute(req: Request, res: Response) {
  const secretAnswerSchema = Joi.object({
    username: Joi.string().min(1).required(),
    secretAnswer: Joi.string().min(1).required(),
    newPassword: Joi.string().min(1).required(),
  });

  const { error, value } = secretAnswerSchema.validate(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  let user;
  try {
    user = await User.findOne({ username: value.username });
  } catch (e) {
    return res.status(500).send(e.message);
  }

  if (!(await bcrypt.compare(value.secretAnswer, user.secretAnswer))) {
    return res.status(400).send("Wrong secret answer!");
  }

  user.password = await bcrypt.hash(value.newPassword, 10);
  try {
    await user.save();
  } catch (e) {
    return res.status(500).send("Error creating user");
  }

  res.status(201).send("Your password was modified!");
}

//Route for updating user permission
export async function updatePermissionRoute(req: Request, res: Response) {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).send("Not logged in");
    return;
  }

  let tokenUserType;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    tokenUserType = (payload as JwtPayload).userType;
  } catch (e) {
    return res.status(401).send("Invalid token");
  }
  if(tokenUserType !== UserType.Admin){
      res.status(401).send("Unauthorized Update Permission Request");
      return;
  }

  const { username, userType } = req.body;
  const userPermission = Joi.object({
    username: Joi.string().min(1).required(),
    userType: Joi.string().valid(...Object.values(UserType)).required(),
  });

  const { error } = userPermission.validate(req.body);

  if (error) {
    return res.status(400).send(error.message);
  }

  if(userType === UserType.Admin){
    res.status(400).send("Cannot update user to admin");
    return;
  }
  
  try {
    await User.findOne({ username });
    if(!User){
      res.status(400).send("User not found");
      return;
    }
    await User.updateOne({ username }, { userType });
    res.status(200).send("User permission updated successfully");
      return;
  }
  catch (error: any) {
    res.status(500).send(error);
    return;
  }
}


export async function updateEventsArray(req: Request, res: Response){
  const { eventid, eventName, eventStartDate, user } = req.body;

  try {
    const userDocument = await User.findOne({ username: user });
    if(!userDocument){
      res.status(400).send("User not found");
      return;
    }
    
    const newEvent = { eventID: eventid, eventName, eventStartDate };
    await User.updateOne({ username: user }, { $push: { eventArray: newEvent } });
    res.status(200).send("Event added to user's event array successfully");
    return;
  }
  catch (error: any) {
    res.status(500).send(error);
    return;
  }
}


export async function getUserClosestEvent(req: Request, res: Response){
  const token = req.cookies.token;
  if (!token) {
    res.status(401).send("Not logged in");
    return;
  }
  let username;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    username = (payload as JwtPayload).username;
  } catch (e) {
    return res.status(401).send("Invalid token");
  }

  const user = await User.findOne({ username: username });

  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  const eventArray = user.eventArray;
  if (eventArray.length === 0) {
    res.status(200).send([]);
    return;
  }
  
  // Sort the eventArray by eventStartDate
  const sortedEventArray = eventArray.sort((a, b) => new Date(a.eventStartDate).getTime() - new Date(b.eventStartDate).getTime());
  const closestEvent = sortedEventArray[0];
  res.status(200).send(closestEvent);
}