import axioss from "../lib/axios"
const API_URL = import.meta.env.VITE_API_URL;

const createCoupon = async(data)=>{
  return await axioss.post(`${API_URL}/v1/seller/create-coupon`, data);
}

const getShopCoupons = async(data)=>{
  return await axioss.get(`${API_URL}/v1/seller/get-coupons`, data);
}



export {
   createCoupon,
   getShopCoupons
};