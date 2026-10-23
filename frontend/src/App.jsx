// import { useState } from 'react'
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  LoginPage,
  SignupPage,
  HomePage,
  AccountActivation,
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
import { useDispatch, useSelector } from "react-redux";
import MainLayout from "./Layouts/MainLayout";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import SellerDashboard from "./pages/SellerDashboard";
import SellerLayout from "./components/SellerDashboard/Layout";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import CreateProduct from "./pages/Vendor/CreateProduct";
import AllProducts from "./pages/Vendor/AllProducts";
import ProductDetails from "./pages/ProductDetails";
import ShopInfoPage from "./pages/ShopInfoPage";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(LoadUserRequest());
    getUser()
      .then((response) => {
        dispatch(LoadUserSuccess(response?.data?.data));
        navigate("/");
      })
      .catch((err) => {
        console.log(err.response);
        dispatch(
          LoadUserFail(err.response?.data?.message || "Failed to load user"),
        );
        navigate("/login");
      });
  }, []);
  const { loading } = useSelector((state) => state.user);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <DotLottieReact
          src="https://lottie.host/babc6f09-8853-4433-891c-9cf9d2b73d0a/hzqFGgEtDP.lottie"
          loop
          autoplay
        />
      </div>
    );
  } else {
    return (
      <>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/:slug/:id" element={<ProductDetails />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/shop/:id" element={<ShopInfoPage />} />

          <Route
            path="/account-activation/:token"
            element={<AccountActivation />}
          />
          {/* Seller Routes Layout  */}
          <Route path="/seller" element={<SellerLayout />}>
            <Route path="dashboard" element={<SellerDashboard />} />
            <Route path="products/create" element={<CreateProduct />} />
            <Route path="products" element={<AllProducts />} />
          </Route>
        </Routes>
      </>
    );
  }
}

export default App;
