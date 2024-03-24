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
  name: string,
  totalTicket: number,
  available: number,
  price: number
}

export interface EventData {
  id: string,
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

