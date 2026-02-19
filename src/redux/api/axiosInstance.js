import axios from 'axios';

/*
=====================================================
 SELECT API BASE URL (MANUAL SWITCH)
-----------------------------------------------------
 Uncomment ONE of the following lines
=====================================================
*/

// const BASE_URL = 'http://localhost:3000'; // commented out localhost
const BASE_URL = 'https://chokmah-resources-backend-wd67.onrender.com'; // switched to production backend

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

// Attach token automatically if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
