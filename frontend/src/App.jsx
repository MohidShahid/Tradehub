// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  LoginPage,
  SignupPage,
  HomePage,
  AccountActivation,
  CreateVendorAccount,
  UserProfile,
} from "./Routes";
import "./App.css";
import { useEffect } from "react";
import { getUser } from "./services/accountService";
import {
  LoadUserSuccess,
  LoadUserRequest,
  LoadUserFail,
} from "./lib/features/userSlice";
import { useDispatch } from "react-redux";
import MainLayout from "./Layouts/MainLayout";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(LoadUserRequest());
    getUser()
      .then((response) => {
        console.log(response.data.data);
        dispatch(LoadUserSuccess(response?.data?.data));
      })
      .catch((err) => {
        console.log(err.response);
        dispatch(LoadUserFail(err.response.message));
      });
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/account-activation/:token"
            element={<AccountActivation />}
          />
          <Route path="/create-seller" element={<CreateVendorAccount />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
