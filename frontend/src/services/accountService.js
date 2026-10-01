import axioss from "../lib/axios"
const API_URL = import.meta.env.VITE_API_URL;

const registerAccount = async(data)=>{
  return await axioss.post(`${API_URL}/v1/user/create`, data);
}


const accountActivation = async(token)=>{
  return await axioss.post(`${API_URL}/v1/user/account-activation`, {token});
}


const loginUser = async (data)=>{
  return await axioss.post(`${API_URL}/v1/user/login`, data);
}

const getUser = async()=>{
   return await axioss.get(`${API_URL}/v1/user/me`);
}

const registerSeller = async(data)=>{
  return await axioss.post(`${API_URL}/v1/user/create-seller`, data);
}

const Logout = async()=>{
  return await axioss.post(`${API_URL}/v1/user/logout`);
}


export {registerAccount, accountActivation, loginUser, getUser, registerSeller, Logout};