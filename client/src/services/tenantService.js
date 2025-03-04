import axios from "./axios";
import queryString from "query-string";

export const getTenants = async (options) => {
  const query = queryString.stringify(options);
  return axios.get(`/tenants?${query}`);
};

export const updateTenant = async () => {
  return axios.put(`/tenants/update/:id`);
};
