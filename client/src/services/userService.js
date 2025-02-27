import axios from "./axios";

export const getUsers = async (options) => {
  const {
    page = 1,
    limit = 8,
    search = "",
    order = {
      created_at: "desc",
    },
  } = options || {};

  return axios.get(
    `/users?page=${page}&limit=${limit}&search=${search}&order=${JSON.stringify(
      order
    )}`
  );
};

export const createUser = async (body) => {
  return axios.post("/users/create", body);
};
