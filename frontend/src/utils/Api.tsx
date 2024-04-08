import axios, { AxiosResponse } from 'axios';
import { production } from './Env';
import { TicketData } from './Types';

class Api {
  baseUrl: string;
  private axiosInstance;

  constructor() {
    this.baseUrl = production ? 'https://technivent.onrender.com/api' : 'http://localhost:3000/api';
    this.axiosInstance = axios.create({
      withCredentials: true
    });
  }

  async getUserData() : Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.get(`${this.baseUrl}/user`)
      return response;
    }
    catch (error: any)
    {
      return null;
    }
  }

  async signUp(payload: { username: string, password: string, secretQuestion: string, secretAnswer: string }): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.post(`${this.baseUrl}/user/signup`, payload);
      return response;
    } catch (error: any) {
      window.alert(error.response.data);
      return null;
    }
  }

  async getSecretQuestion(payload: { username: string }): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.post(`${this.baseUrl}/user/secret-question`, payload);
      return response;
    } catch (error: any) {
      window.alert(error.response.data);
      return null;
    }
  }

  async getPassword(payload: { username: string, secretAnswer: string, newPassword: string }): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.post(`${this.baseUrl}/user/reset-password`, payload);
      return response;
    } catch (error: any) {
      window.alert(error.response.data);
      return null;
    }
  }

  async PostComment(payload: { username: string, eventId: string, comment: string }): Promise<any> {
    try {
      const currentDate = new Date().toISOString();
      const response: AxiosResponse = await this.axiosInstance.post(`${this.baseUrl}/comment`, {...payload, date: currentDate});
      return response;
    } catch (error: any) {
      window.alert(error.response.data);
      return null;
    }
  }

  async addEvent(payload: { 
    title: string, 
    category: string, 
    description: string, 
    organizer: string, 
    location: string, 
    start_date: Date, 
    end_date: Date, 
    image: string, 
    ticketArray: TicketData[], 
    rating: { average: number, total: number } 
  }): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.post(`${this.baseUrl}/event`, payload);
      return response;
    } catch (error: any) {
      window.alert(error.response.data);
      return null;
    }
  }

  async Login(payload: { username: string, password: string }): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.post(`${this.baseUrl}/user/login`, payload);
      return response;
    } catch (error: any) {
      window.alert(error.response.data);
      return null;
    }
  }

  async logout(): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.put(`${this.baseUrl}/user/logout`);
      return response;
    } catch (error: any) {
      window.alert(error.response.data);
      return null;
    }
  }

  async getEvents(query: string = '')
  {
    try{
      const response: AxiosResponse = await this.axiosInstance.get(`${this.baseUrl}/event`, { params: { all: query } });
      return response;
    } catch (error: any) {
      window.alert(error.response.data);
      return null;
    }
  }

  async getEventById(id: string) {
    const url = `${this.baseUrl}/event?id=${id}`;
    try {
      const response: AxiosResponse = await this.axiosInstance.get(url);
      return response;
    } catch (error: any) {
      window.alert(error.response.data); // Log the error to the console
      return null;
    }
  }

  async getPayments() {
    try {
      const response: AxiosResponse = await this.axiosInstance.get(`${this.baseUrl}/payment`);
      return response;
    } catch (error: any) {
      window.alert(error.response.data);
      return null;
    }
  }


  async updateEventDates(payload: { id: string, start_date: Date, end_date: Date }): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.put(`${this.baseUrl}/event/${payload.id}`, payload);
      return response;
    } catch (error: any) {
      window.alert(error.response.data);
      return null;
    }
  }

  async processPayment(payload: { eventID: string, creditCardNum: string, holder: string, cvv: string, expDate: string, ticketId: string, ticketName: string, ticketPrice: number, quantity: number }): Promise<any> {
    try {
      const response: AxiosResponse = await this.axiosInstance.post(`${this.baseUrl}/payment`, payload);
      return response;
    } catch (error: any) {
      window.alert(error.response.data);
      return null;
    }
  }
  
  
}



export default Api