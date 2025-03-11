import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import store from "./store/store.js";

import App from "./App.jsx";
import Home from "./components/home/Home.jsx";
import Products from "./components/products/Products.jsx";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import MyProducts from "./components/products/MyProducts.jsx";
import Profile from "./components/profile/Profile.jsx";
import Cart from "./components/order/Cart.jsx";
import Orders from "./components/order/Orders.jsx";
import PageNotFound from "./utils/PageNotFound.jsx";
import ProfileAddressCard from "./components/profile/ProfileAccountCard.jsx";
import ProfileAccountContainer from "./components/profile/ProfileAddressContainer.jsx";
import ContactUs from "./components/profile/ContactUs.jsx";
import AddAddress from "./components/profile/AddAddress.jsx";
import UpdateAddress from "./components/profile/UpdateAddress.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AddProduct from "./components/products/AddProducts.jsx";
import UpdateProducts from "./components/products/UpdateProducts.jsx";
import BuyProduct from "./components/order/BuyProduct.jsx";

import "./index.css";

const queryClient = new QueryClient();

const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "/login",
        element: (
          <ProtectedRoute isRouteNeededAuth={false}>
            <Login />,
          </ProtectedRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <ProtectedRoute isRouteNeededAuth={false}>
            <Signup />,
          </ProtectedRoute>
        ),
      },
      {
        path: "/myproducts",
        element: (
          <ProtectedRoute isRouteNeededAuth={true}>
            <MyProducts />,
          </ProtectedRoute>
        ),
      },
      {
        path: "/product/addproducts",
        element: (
          <ProtectedRoute isRouteNeededAuth={true}>
            <AddProduct />,
          </ProtectedRoute>
        ),
      },
      {
        path: "product/updateproduct/:id",
        element: (
          <ProtectedRoute isRouteNeededAuth={true}>
            <UpdateProducts />,
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute isRouteNeededAuth={true}>
            <Profile />,
          </ProtectedRoute>
        ),

        children: [
          {
            path: "/profile/address",
            element: <ProfileAccountContainer />,
          },
          {
            path: "/profile/addaddress",
            element: <AddAddress />,
          },
          {
            path: "/profile/updateaddress/:id",
            element: <UpdateAddress />,
          },
          {
            path: "/profile/account",
            element: <ProfileAddressCard />,
          },
          {
            path: "profile/contactus",
            element: <ContactUs />,
          },
        ],
      },
      {
        path: "/cart",
        element: (
          <ProtectedRoute isRouteNeededAuth={true}>
            <Cart />,
          </ProtectedRoute>
        ),
      },
      {
        path: "/product/buyproduct/:id",
        element: (
          <ProtectedRoute isRouteNeededAuth={true}>
            <BuyProduct />,
          </ProtectedRoute>
        ),
      },
      {
        path: "/orders",
        element: (
          <ProtectedRoute isRouteNeededAuth={true}>
            <Orders />,
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={route}>
          <App />
        </RouterProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
