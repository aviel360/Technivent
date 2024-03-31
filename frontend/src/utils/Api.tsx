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
      return response;
    } catch (error: any) {
      window.alert(error)
      return null;
    }
  }

  async getSecretQuestion(payload: { username: string }): Promise<any> {
    try {
      const response: AxiosResponse = await axios.post(`${this.baseUrl}/user/secret-question`, payload);
      return response;
    } catch (error: any) {
      window.alert(error.response.data)
      return null;
    }
  }

  async getPassword(payload: { username: string, secretAnswer: string, newPassword: string }): Promise<any> {
    try {
      const response: AxiosResponse = await axios.post(`${this.baseUrl}/user/reset-password`, payload);
      return response;
    } catch (error: any) {
      window.alert(error.response.data)
      return null;
    }
  }

  async Login(payload: { username: string, password: string }): Promise<any> {
    try {
      const response: AxiosResponse = await axios.post(`${this.baseUrl}/user/login`, payload);
      return response;
    } catch (error: any) {
      window.alert(error)
      return null;
    }
  }

  async getEvents(query: string = '')
  {
    try{
      const response: AxiosResponse = await axios.get(`${this.baseUrl}/event/${query}`)
      return response;
    } catch (error: any) {
      window.alert(error)
      return null;
    }
  }
}

export default Api