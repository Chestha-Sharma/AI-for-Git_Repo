import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 180000, // LLM ka jawab aane me time lag sakta hai
})
