import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.response.status === 401) {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/refresh-token`,
          {
            token: localStorage.getItem("refreshToken"),
          }
        );
        const { token } = response.data;
        localStorage.setItem("token", token);
        return axiosInstance(error.config);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
