import axioss from "../lib/axios"
const API_URL = import.meta.env.VITE_API_URL;

const registerAccount = async(data)=>{
  return await axioss.post(`${API_URL}/v1/user/create`, data);
}


const accountActivation = async(token)=>{
  return await axioss.post(`${API_URL}/v1/user/account-activation`, {token});
}




export {registerAccount, accountActivation};