// Payment
export const PAYMENT_BY_USER = "/api/payment/:username";
export const PAYMENT_ROUTE = "/api/payment";

export const HAMMERHEAD_API = "https://www.cs-wsp.net/_functions/pay";

// Ticket
export const TICKET_LOCK_PATH = "/api/ticket/lock";
export const TICKET_SERVICE_LOCAL = "http://localhost:3004";
export const TICKET_SERVICE_PRODUCTION = "https://technivent-ticket.onrender.com";
export const TICKET_SERVICE = process.env.NODE_ENV === "production" ? TICKET_SERVICE_PRODUCTION : TICKET_SERVICE_LOCAL;
