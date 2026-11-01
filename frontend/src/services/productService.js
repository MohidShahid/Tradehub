import axioss from "../lib/axios"
const API_URL = import.meta.env.VITE_API_URL;

const createProduct = async(data)=>{
  return await axioss.post(`${API_URL}/v1/product/create`, data);
}



export {
   createProduct
};