import axios, { AxiosResponse } from 'axios';

class Api {
  baseUrl: string;

  constructor() {
    this.baseUrl = 'https://technivent.onrender.com/api';
  }

  fetchData(): Promise<any> {
    return axios.get(this.baseUrl)
      .then((response: AxiosResponse) => response.data);
  }

  async signUp(payload: { username: string, password: string, secretQuestion: string, secretAnswer: string }): Promise<any> {
    try {
      const response: AxiosResponse = await axios.post(`${this.baseUrl}/user/signup`, payload);
      return response;
    } catch (error: any) {
      window.alert(error.message);
      return null;
    }
  }

  async getSecretQuestion(payload: { username: string }): Promise<any> {
    try {
      const response: AxiosResponse = await axios.post(`${this.baseUrl}/user/secret-question`, payload);
      return response;
    } catch (error: any) {
      window.alert(error.message);
      return null;
    }
  }

  async getPassword(payload: { username: string, secretAnswer: string, newPassword: string }): Promise<any> {
    try {
      const response: AxiosResponse = await axios.post(`${this.baseUrl}/user/reset-password`, payload);
      return response;
    } catch (error: any) {
      window.alert(error.message);
      return null;
    }
  }

  async Login(payload: { username: string, password: string }): Promise<any> {
    try {
      const response: AxiosResponse = await axios.post(`${this.baseUrl}/user/login`, payload);
      return response;
    } catch (error: any) {
      window.alert(error.message);
      return null;
    }
  }

  

  async getEvents(query: string = '')
  {
    
    try{
      const response: AxiosResponse = await axios.get(`${this.baseUrl}/event/${query}`)
      return response;
    } catch (error: any) {
      window.alert(error.message);
      return null;
    }
  }

  async getEventById(id: string) {
    const url = `${this.baseUrl}/event/${id}`;
    console.log(`Requesting event with id ${id} from ${url}`); // Log the id and the request URL
    try {
      const response: AxiosResponse = await axios.get(url);
      return response;
    } catch (error: any) {
      window.alert(error.message); // Log the error to the console
      return null;
    }
  }

  async getEventById(id: string) {
    const url = `${this.baseUrl}/event/${id}`;
    console.log(`Requesting event with id ${id} from ${url}`); // Log the id and the request URL
    try {
      const response: AxiosResponse = await axios.get(url);
      return response;
    } catch (error: any) {
      console.error(error); // Log the error to the console
      return null;
    }
  }
}

export default Api