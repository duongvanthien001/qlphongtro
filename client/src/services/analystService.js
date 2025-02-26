import axios from "./axios";

export const getAnalyst = async () => {
  return axios.get("/analyst");
};
