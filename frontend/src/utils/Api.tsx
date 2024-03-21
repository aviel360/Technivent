import axios, { AxiosResponse } from 'axios';

class Api {
  baseUrl: string;

  constructor() {
    this.baseUrl = 'http://localhost:8080/';
  }

  fetchData(): Promise<any> {
    return axios.get(this.baseUrl)
      .then((response: AxiosResponse) => response.data);
  }

  async signUp(payload: { username: string, password: string }): Promise<any> {
    try {
      const response: AxiosResponse = await axios.post(`${this.baseUrl}/signup`, payload);
      return response.data;
    } catch (error: any) {
      throw new Error('Error signing up: ' + error.message);
    }
  }
}

export default Api