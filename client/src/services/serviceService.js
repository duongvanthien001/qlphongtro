import axios from "./axios";
import queryString from "query-string";

export const getServices = async (options) => {
  const query = queryString.stringify(options, {
    skipEmptyString: true,
  });
  return await axios.get(`/services?${query}`);
};

export const getServiceById = async (id) => {
  return await axios.get(`/services/${id}`);
};

export const createService = async (data) => {
  return await axios.post("/services/create", data);
};

export const updateService = async (id, data) => {
  return await axios.put(`/services/update/${id}`, data);
};

export const deleteService = async (id) => {
  return await axios.delete(`/services/delete/${id}`);
};
