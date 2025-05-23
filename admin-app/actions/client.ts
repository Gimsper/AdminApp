import axios from 'axios';
const API_URL = "https://adminapi-4nd3.onrender.com";

export const client = axios.create({
  baseURL: API_URL,
  timeout: 1000000,
  headers: {
    'Content-Type': 'application/json',
  },
});