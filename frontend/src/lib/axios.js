import axios from "axios";

// 1. Create the instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
  withCredentials: true,
});

// 2. Named Export (This fixes the 'api.js' error you see now)
export { axiosInstance };

// 3. Default Export (This fixes the 'Friends.jsx' error from earlier)
export default axiosInstance;