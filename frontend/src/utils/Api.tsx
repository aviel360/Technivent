import axios, { AxiosResponse } from 'axios';

class Api {
  baseUrl: string;

  constructor() {
    this.baseUrl = 'http://localhost:3000/api';
  }

  fetchData(): Promise<any> {
    return axios.get(this.baseUrl)
      .then((response: AxiosResponse) => response.data);
  }

  async signUp(payload: { username: string, password: string, secretQuestion: string, secretAnswer: string }): Promise<any> {
    try {
      const response: AxiosResponse = await axios.post(`${this.baseUrl}/user/signup`, payload);
      return response.data;
    } catch (error: any) {
      throw new Error('Error signing up: ' + error.message);
    }
  }

  async Login(payload: { username: string, password: string }): Promise<any> {
    try {
      const response: AxiosResponse = await axios.post(`${this.baseUrl}/user/login`, payload);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  async getEvents(query: string = '')
  {
    try{
      const response: AxiosResponse = await axios.get(`${this.baseUrl}/event${query}`)
      return response.data;
    } catch (error: any) {
      throw new Error('Error fetching event ' + error.message);
    }
  }
}

export default Api