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

export interface Rating {
  totalRatings: number,
  average: number
}

export interface TicketData {
  _id?: string,
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
  ticketArray: TicketData[],
  image: string,
  rating: Rating
}

export enum UserType {
  User = "User",
  Admin = "Admin",
  Manager = "Manger",
  Worker = "Worker"
}
export interface EventResponse {
  dbRes: EventData;
}


export interface CommentData {
  _id: string,
  eventID: string,
  username: string,
  date: Date,
  commentText: string
}

