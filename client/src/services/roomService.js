import axios from "./axios";

export const getRooms = async (options) => {
  const {
    page = 1,
    limit = 8,
    search = "",
    order = { id: "desc" },
  } = options || {};

  return axios.get(
    `/rooms?page=${page}&limit=${limit}&search=${search}&order=${JSON.stringify(
      order
    )}`
  );
};

export const getRoomById = async (id) => {
  return axios.get(`/rooms/${id}`);
};

export const createRoom = async (data) => {
  return axios.post("/rooms/create", data);
};

export const updateRoom = async (id, data) => {
  return axios.put(`/rooms/update/${id}`, data);
};

export const deleteRoom = async (id) => {
  return axios.delete(`/rooms/delete/${id}`);
};
