import axios from "axios";
import store from "../store/store";
import { logout } from "../store/authSlice";

const axiosInstanceProducts = axios.create({
  baseURL: "http://localhost:5001/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the interceptor globally
axiosInstanceProducts.interceptors.response.use(
  (response) => response, // Return successful response as is
  (error) => {
    if (error.response) {
      const status = error.response.status;

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

export default axiosInstanceProducts;
