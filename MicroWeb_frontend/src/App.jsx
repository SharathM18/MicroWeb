import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Toaster, toast } from "sonner";

import axiosInstance from "./utils/axiosInstance";
import axiosInstanceProducts from "./utils/axiosInstanceProducts";
import { login, logout } from "./store/authSlice";

import Navbar from "./components/Navbar";

import "./App.css";

function App() {
  const dispatch = useDispatch();

  // verify token on refresh
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        dispatch(logout());
      } else {
        try {
          const response = await axiosInstance.get("/auth/verify-token", {
            headers: { "x-auth-token": token },
          });

          dispatch(
            login({
              token: response.data.token,
              // user_id
              userId: response.data.data,
            })
          );

          toast.success(
            response.data?.message || "Refresh token verified successfully!",
            { duration: 3000 }
          );

          axiosInstance.defaults.headers.common["x-auth-token"] =
            response.data.token;

          axiosInstanceProducts.defaults.headers.common["x-auth-token"] =
            response.data.token;
        } catch (error) {
          toast.error(
            error.response?.data?.message ||
              "Token has expired. Please try to login again..."
          );
          dispatch(logout());
        }
      }
    };

    verifyToken();
  }, []);

  return (
    <>
      <Toaster position="bottom-left" richColors />
      <div className="app">
        <Navbar />
        <main className="main"></main>
        <Outlet />
      </div>
    </>
  );
}

export default App;
