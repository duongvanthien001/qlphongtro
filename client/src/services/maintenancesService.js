import axios from "./axios";
import queryString from "query-string";

export const getMaintenances = async (options) => {
  const query = queryString.stringify(options, {
    skipEmptyString: true,
  });
  return axios.get(`/maintenances?${query}`);
};

export const getMaintenancesByCurrentUser = async (options) => {
  const query = queryString.stringify(options, {
    skipEmptyString: true,
  });
  return axios.get(`/maintenances/current?${query}`);
};

export const getMaintenanceById = async (id) => {
  return axios.get(`/maintenances/${id}`);
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
