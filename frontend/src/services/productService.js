import axioss from "../lib/axios"
const API_URL = import.meta.env.VITE_API_URL;

const createProduct = async(data)=>{
  return await axioss.post(`${API_URL}/v1/product/create`, data);
}

const getShopProducts = async()=>{
  return await axioss.get(`${API_URL}/v1/product/shop`);
}

const getProducts = async(params)=>{
  return await axioss.get(`${API_URL}/v1/product/public?page=${params.page}&limit=${params.limit}`);
}

export {
   createProduct,
   getProducts,
   getShopProducts,
};