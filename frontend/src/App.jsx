// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LoginPage, SignupPage, HomePage, AccountActivation, CreateVendorAccount } from './Routes'
import './App.css'
import { useEffect } from 'react'
import { getUser } from './services/accountService'

function App() {
 useEffect(()=>{
    getUser().then((response)=>{
      console.log(response.data.data)
    }).catch((err)=>{
      console.log(err.response)
    })
 },[])

  return (
    <>
    <BrowserRouter>
    <Routes>
    <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<LoginPage />}/>
      <Route path='/signup' element={<SignupPage />}/>
      <Route path='/account-activation/:token' element={<AccountActivation/>} />
      <Route path='/create-seller' element={<CreateVendorAccount />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
