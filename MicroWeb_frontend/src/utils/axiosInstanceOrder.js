import axios from "axios";
import store from "../store/store";
import { logout } from "../store/authSlice";
import { toast } from "sonner";

const axiosInstanceOrder = axios.create({
  baseURL: "http://localhost:5002/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the interceptor globally
axiosInstanceOrder.interceptors.response.use(
  (response) => response, // Return successful response as is
  (error) => {
    if (error.response) {
      const status = error.response.status;
      toast.error(
        error.response?.data?.error ||
          "Something went wrong. Please try to login again.",
        {
          duration: 3000,
        }
      );

      if (status === 401) {
        // Unauthorized access → Token is invalid or expired
        store.dispatch(logout()); // Clear token & user state

        // Redirect will be handled inside React components
        window.location.href = "/login"; // Temporary full-page reload solution
      }
    }
    return Promise.reject(error); // Pass error to the caller
  }
);

export default axiosInstanceOrder;
