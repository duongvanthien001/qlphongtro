import axios from "./axios";
import queryString from "query-string";

export const getContracts = async (options) => {
  const query = queryString.stringify(options);
  return axios.get(`/contracts?${query}`);
};

export const getContractById = async (id) => {
  return axios.put(`/contracts/${id}`);
};

export const createContract = async (data) => {
  return axios.post("/contracts/create", data);
};

export const updateContract = async (id, data) => {
  return axios.put(`/contracts/update/${id}`, data);
};

export const deleteContract = async (id) => {
  return axios.delete(`/contracts/delete/${id}`);
};
