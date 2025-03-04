import axios from "./axios";
import queryString from "query-string";

export const getMaintenances = async (options) => {
  const query = queryString.stringify(options);
  return axios.get(`/maintenances?${query}`);
};

export const createMaintenance = async (data) => {
  return axios.post("/maintenances/create", data);
};

export const updateMaintenance = async (id, data) => {
  return axios.put(`/maintenances/update/${id}`, data);
};

export const deleteMaintenance = async (id) => {
  return axios.delete(`/maintenances/delete/${id}`);
};
