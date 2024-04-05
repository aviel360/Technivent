import { env } from "process";

// User
export const USER_PATH = "/api/user";
export const LOGIN_PATH = "/api/user/login";
export const LOGOUT_PATH = "/api/user/logout";
export const SIGNUP_PATH = "/api/user/signup";
export const SECRET_QUESTION_PATH = "/api/user/secret-question";
export const PASSWORD_RESET = "/api/user/reset-password";


// Event
export const EVENT_SERVICE_LOCAL = "http://localhost:3001";
export const EVENT_SERVICE_PRODUCTION = "https://technivent-jq4c.onrender.com";
export const EVENT_PATH = "/api/event";
export const EVENT_BY_ID = "/api/event/:id";
export const EVENT_SERVICE = process.env.NODE_ENV === "production" ? EVENT_SERVICE_PRODUCTION : EVENT_SERVICE_LOCAL;

// Comment
export const COMMENT_PATH =  "/api/comment";
export const COMMENT_SERVICE_LOCAL = "http://localhost:3002";
export const COMMENT_SERVICE_PRODUCTION = "https://technivent-comment.onrender.com";
export const COMMENT_SERVICE = process.env.NODE_ENV === "production" ? COMMENT_SERVICE_PRODUCTION : COMMENT_SERVICE_LOCAL;

