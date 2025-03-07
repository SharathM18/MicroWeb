import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { z } from "zod";
import { toast } from "sonner";

import { login } from "../../store/authSlice";
import axiosInstance from "../../utils/axiosInstance";
import axiosInstanceProducts from "../../utils/axiosInstanceProducts";

import "../../style/login.css";

import loginImage from "../../assets/images/undraw_in-the-zone.svg";

// validation schema for login form
const schema = z.object({
  email: z.string().optional(),
  password: z.string().optional(),
});

const Login = () => {
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  // sends a POST request to the server to login the user
  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.post("/auth/login", data);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      axiosInstance.defaults.headers.common["x-auth-token"] = data.token;
      axiosInstanceProducts.defaults.headers.common["x-auth-token"] =
        data.token;

      dispatch(login({ token: data.token, userId: data.data }));

      toast.success(data.message || "Login successful! Redirecting...", {
        duration: 3000,
      });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage, { duration: 3000 });
    },
  });

  return (
    <>
      <section className="login_container">
        <div className="login_design">
          <img src={loginImage} className="login_image" alt="login_image" />
        </div>

        <div className="login_box">
          <h1>Login</h1>
          <p>Securely access your account</p>

          <form
            className="login_fields"
            onSubmit={handleSubmit((data) => mutate(data))}
          >
            <div className="input_email field">
              <label htmlFor="email">Email </label>
              <input
                type="text"
                name="email"
                placeholder="example@example.com"
                {...register("email")}
              />
            </div>

            <div className="input_password field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                {...register("password")}
              />
            </div>

            <div className="submit_btn">
              <button className="btn" type="submit" disabled={isPending}>
                {isPending ? "Loading..." : "Login"}
              </button>
            </div>
          </form>

          <div className="signup_link">
            Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
