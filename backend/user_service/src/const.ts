
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

// Payment
export const PAYMENT_PATH = "/api/payment";
export const PAYMENT_SERVICE_LOCAL = "http://localhost:3003";
export const PAYMENT_SERVICE_PRODUCTION = "https://technivent-payment.onrender.com";
export const PAYMENT_SERVICE = process.env.NODE_ENV === "production" ? PAYMENT_SERVICE_PRODUCTION : PAYMENT_SERVICE_LOCAL;

// Ticket
export const TICKET_LOCK_PATH = "/api/ticket/lock";
export const TICKET_GET = "/api/ticket";
export const TICKET_SERVICE_LOCAL = "http://localhost:3004";
export const TICKET_SERVICE_PRODUCTION = "https://technivent-ticket.onrender.com";
export const TICKET_SERVICE = process.env.NODE_ENV === "production" ? TICKET_SERVICE_PRODUCTION : TICKET_SERVICE_LOCAL;
