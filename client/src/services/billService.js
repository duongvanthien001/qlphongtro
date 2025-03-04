import axios from "./axios";
import queryString from "query-string";

export const getBills = async (options) => {
  const query = queryString.stringify(options);
  return axios.get(`/bills?${query}`);
};

export const createBill = async (data) => {
  return axios.post("/bills/create", data);
};

export const updateBill = async (id, data) => {
  return axios.put(`/bills/update/${id}`, data);
};

export const deleteBill = async (id) => {
  return axios.delete(`/bills/delete/${id}`);
};
