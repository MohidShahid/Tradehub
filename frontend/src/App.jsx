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
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerLayout from "./components/SellerDashboard/Layout";
import LoadingScreen from "./components/LoadingScreen";
import CreateProduct from "./pages/seller/CreateProduct";
import AllProducts from "./pages/seller/AllProducts";
import ProductDetails from "./pages/ProductDetails";
import ShopInfoPage from "./pages/ShopInfoPage";
import Coupons from "./pages/seller/Coupons";

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
    return <LoadingScreen message="Preparing your marketplace..." />;
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
            <Route path="coupons" element={<Coupons />} />
          </Route>
        </Routes>
      </>
    );
  }
}

export default App;
