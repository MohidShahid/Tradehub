// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LoginPage, SignupPage, HomePage, AccountActivation } from './Routes'
import './App.css'

function App() {


  return (
    <>
    <BrowserRouter>
    <Routes>
    <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<LoginPage />}/>
      <Route path='/signup' element={<SignupPage />}/>
      <Route path='/account-activation/:token' element={<AccountActivation/>} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
