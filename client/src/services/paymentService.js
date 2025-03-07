import queryString from "query-string";
import axios from "./axios";

export const getPayments = async (options) => {
  const query = queryString.stringify(options, {
    skipEmptyString: true,
  });
  return await axios.get(`/payments?${query}`);
};

export const getPaymentById = async (id) => {
  return await axios.get(`/payments/${id}`);
};

export const createPayment = async (data) => {
  return await axios.post("/payments/create", data);
};

export const updatePayment = async (id, data) => {
  return await axios.put(`/payments/update/${id}`, data);
};

export const deletePayment = async (id) => {
  return await axios.delete(`/payments/delete/${id}`);
};
