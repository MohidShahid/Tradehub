import axioss from "../lib/axios";
const API_URL = import.meta.env.VITE_API_URL;

export const createOrder = async (orderData) => {
  return await axioss.post(`${API_URL}/v1/order/create`, orderData);
};

export const verifyPayment = async (data) => {
  return await axioss.post(`${API_URL}/v1/order/verify-payment`, data);
};

export const getOrderDetails = async (id) => {
  return await axioss.get(`${API_URL}/v1/order/${id}`);
};

export const getMyOrders = async () => {
  return await axioss.get(`${API_URL}/v1/order/my-orders`);
};

export const getSellerOrders = async () => {
  return await axioss.get(`${API_URL}/v1/order/seller/orders`);
};

export const updateOrderStatus = async (id, orderStatus) => {
  return await axioss.put(`${API_URL}/v1/order/seller/status/${id}`, {
    orderStatus,
  });
};
