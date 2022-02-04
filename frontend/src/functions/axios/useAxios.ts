import axios from "axios";

export const useAxios = ()=>{
    const instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_URL || "http://localhost:8000",
        withCredentials: true
    })
    return instance
}