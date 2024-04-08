import Ticket from "./ticket.js";

interface LockedTickets {
  ticketId: string;
  lockedTickets: number;
  timeoutId: NodeJS.Timeout;
}

interface UserLockedTickets {
  [username: string]: LockedTickets;
}

export class TicketManager {
  private lockedTickets: UserLockedTickets = {};

  async lockTickets(username: string, ticketId: string, lockedTickets: number, purchaseFlag: boolean): Promise<void> {
    try {
      const userTickets = this.lockedTickets[username];
      let ticketAmount = lockedTickets;
      if (userTickets) {
        clearTimeout(this.lockedTickets[username].timeoutId);
        ticketAmount = lockedTickets - userTickets.lockedTickets;
      }
      console.log(username, ticketId, lockedTickets, purchaseFlag)
      const gteLock = ticketAmount > 0 ? ticketAmount : 0;
      const ticket = await Ticket.findOneAndUpdate(
        { _id: ticketId, available: { $gte: gteLock } }, // Ensure available tickets are sufficient
        { $inc: { available: -ticketAmount } }, // Decrement available tickets
        { new: true } // Return the updated document
      );

      if (!ticket) throw new Error("Ticket is not available");

      this.lockedTickets[username] = {
        ticketId,
        lockedTickets,
        timeoutId: purchaseFlag
          ? null
          : setTimeout(() => {
              this.unlockTickets(username);
            }, 2 * 60 * 1000),
      };
    } catch (error) {
      throw error;
    }
  }

  async unlockTickets(username: string): Promise<void> {
    try {
      const userTickets = this.lockedTickets[username];
      await Ticket.findByIdAndUpdate(
        userTickets.ticketId,
        { $inc: { available: userTickets.lockedTickets } }, // Increment available tickets
        { new: true } // Return the updated document
      );
      delete this.lockedTickets[username];

    } catch (error) {
      throw error;
    }
  }

  async deleteLockedTickets(username: string): Promise<void> {
    try {
      delete this.lockedTickets[username];
    } catch (error) {
      throw error;
    }
  }
}
