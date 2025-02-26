import axios from "axios";

export const login = async (username, password) => {
  const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
    username,
    password,
  });
  return res.data;
};
