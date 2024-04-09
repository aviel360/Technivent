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

export interface RatingType {
  average: number,
  total: number
}

export interface TicketData {
  _id?: string,
  eventID: string,
  name: string,
  totalTickets: number,
  available: number,
  price: number
}

export interface EventData {
  _id: string,
  title: string,
  category: EventCategory,
  description: string,
  organizer: string,
  start_date: Date,
  end_date: Date,
  location: string,
  image: string,
  rating: RatingType,
  ticketArray: TicketData[],
}

export interface OrderHistoryData {
  event: EventData,
  transactions: PaymentData[]
}

export enum UserType {
  User = "User",
  Admin = "Admin",
  Manager = "Manager",
  Worker = "Worker"
}
export interface EventResponse {
  dbRes: EventData;
}

export interface PaymentData {
  _id: string,
  eventID: string,
  username: string,
  date: Date,
  ticketName: string,
  quantity: number
}

export interface CommentData {
  _id: string,
  eventID: string,
  username: string,
  date: Date,
  commentText: string
}


export enum Months {
  January = "01",
  February = "02",
  March = "03",
  April = "04",
  May = "05",
  June = "06",
  July = "07",
  August = "08",
  September = "09",
  October = "10",
  November = "11",
  December = "12"
}

