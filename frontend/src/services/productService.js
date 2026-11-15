import axioss from "../lib/axios"
const API_URL = import.meta.env.VITE_API_URL;

const createProduct = async(data)=>{
  return await axioss.post(`${API_URL}/v1/product/create`, data);
}

const getShopProducts = async (params = {}) => {
  const page = params.page || 1;
  const limit = params.limit || 10;
  return await axioss.get(`${API_URL}/v1/product/shop`, {
    params: { page, limit },
  });
};

const getProducts = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);
  if (params.category) query.append("category", params.category);
  if (params.excludeId) query.append("excludeId", params.excludeId);
  const queryString = query.toString();
  return await axioss.get(
    `${API_URL}/v1/product/public${queryString ? `?${queryString}` : ""}`
  );
};

const getProductDetails = async (id) => {
  return await axioss.get(`${API_URL}/v1/product/${id}`);
};

const updateProduct = async (id, data) => {
  return await axioss.put(`${API_URL}/v1/product/update/${id}`, data);
};

const deleteProduct = async (id) => {
  return await axioss.delete(`${API_URL}/v1/product/${id}`);
};

export {
  createProduct,
  getProducts,
  getProductDetails,
  getShopProducts,
  updateProduct,
  deleteProduct,
};