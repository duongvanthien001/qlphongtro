import axios from "./axios";
import queryString from "query-string";

export const getBills = async (options) => {
  const query = queryString.stringify(options, { skipEmptyString: true });
  return axios.get(`/bills?${query}`);
};

export const getBillsCurrentUser = async (options) => {
  const query = queryString.stringify(options, { skipEmptyString: true });
  return axios.get(`/bills/current-user?${query}`);
};

export const getBillById = async (id) => {
  return axios.get(`/bills/${id}`);
};

export const createBill = async (body) => {
  return axios.post("/bills/create", body);
};

export const updateBill = async (id, data) => {
  return axios.put(`/bills/update/${id}`, data);
};

export const deleteBill = async (id) => {
  return axios.delete(`/bills/delete/${id}`);
};
