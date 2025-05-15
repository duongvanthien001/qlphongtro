import axios from "./axios";
import queryString from "query-string";

export const getRooms = async (options) => {
  const query = queryString.stringify(options, {
    skipEmptyString: true,
  });

  return axios.get(`/rooms?${query}`);
};

export const getRoomsCurrentUser = async (options) => {
  const query = queryString.stringify(options, {
    skipEmptyString: true,
  });

  return axios.get(`/rooms/current-user?${query}`);
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
