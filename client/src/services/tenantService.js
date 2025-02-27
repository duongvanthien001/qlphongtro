import axios from "./axios";

export const getTenants = async () => {
  return axios.get("/tenants");
};
