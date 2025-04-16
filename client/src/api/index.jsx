import axios from 'axios'
import { handleErrors } from "../utils/common"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": 'application/json'
    }
})

api.interceptors.response.use(res => res, err => {
    if (err.response?.status === 401) window.location = '/login'
    handleErrors(err)
    return Promise.reject(err)
})

export default api