import axios from "./axios";

export const getAnalyst = async () => {
  return axios.get("/analyst");
};

export const getReport = async () => {
  return axios.get("/analyst/report");
};
