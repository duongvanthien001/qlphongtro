import axios from "./axios";
import queryString from "query-string";

export const getUsers = async (options) => {
  const query = queryString.stringify(options, {
    skipEmptyString: true,
  });
  return axios.get(`/users?${query}`);
};

export const getUserById = async (id) => {
  return axios.get(`/users/${id}`);
};

export const getCurrentUser = async () => {
  return axios.get("/users/me");
};

export const createUser = async (body) => {
  return axios.post("/users/create", body);
};

export const updateCurrentUser = async (body) => {
  return axios.put("/users/update/me", body);
};

export const updateUser = async (id, body) => {
  return axios.put(`/users/update/${id}`, body);
};

export const changePassword = async (body) => {
  return axios.put("/users/change-password", body);
};

export const deleteUser = async (id) => {
  return axios.delete(`/users/delete/${id}`);
};
