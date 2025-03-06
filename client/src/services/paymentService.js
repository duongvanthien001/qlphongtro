import queryString from "query-string";
import axios from "./axios";

export const getPayments = async (options) => {
  const query = queryString.stringify(options);
  return await axios.get(`/payments?${query}`);
};

export const createPayment = async (data) => {
  return await axios.post("/payments", data);
};

export const updatePayment = async (id, data) => {
  return await axios.put(`/payments/${id}`, data);
};

export const deletePayment = async (id) => {
  return await axios.delete(`/payments/${id}`);
};
