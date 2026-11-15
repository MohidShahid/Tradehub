import axioss from "../lib/axios";
const API_URL = import.meta.env.VITE_API_URL;

export const createAddress = async (data) => {
  return await axioss.post(`${API_URL}/v1/address/create`, data);
};

export const getUserAddresses = async () => {
  return await axioss.get(`${API_URL}/v1/address`);
};

export const getAddressById = async (id) => {
  return await axioss.get(`${API_URL}/v1/address/${id}`);
};

export const updateAddress = async (id, data) => {
  return await axioss.put(`${API_URL}/v1/address/${id}`, data);
};

export const deleteAddress = async (id) => {
  return await axioss.delete(`${API_URL}/v1/address/${id}`);
};

export const setDefaultAddress = async (id) => {
  return await axioss.patch(`${API_URL}/v1/address/${id}/default`);
};
