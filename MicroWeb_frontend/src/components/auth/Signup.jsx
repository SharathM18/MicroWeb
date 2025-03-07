import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

import { signup } from "../../store/authSlice";
import axiosInstance from "../../utils/axiosInstance";
import axiosInstanceProducts from "../../utils/axiosInstanceProducts";

import loginImage from "../../assets/images/undraw_in-the-zone.svg";

// validation schema for signup form
const schema = z.object({
  fullName: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  mobileNumber: z.string().optional(),
});

const Signup = () => {
  const dispatch = useDispatch();

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
  });

  // sends a POST request to the server to signup the user
  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      console.log(data);
      const response = await axiosInstance.post("/auth/signup", data);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      axiosInstance.defaults.headers.common["x-auth-token"] = data.token;
      axiosInstanceProducts.defaults.headers.common["x-auth-token"] =
        data.token;

      dispatch(signup({ token: data.token, userId: data.data.user_id }));

      toast.success(data.message || "Signup successful! Redirecting...", {
        duration: 3000,
      });

      // navigate("/"); // protected route take care of this
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
      <section
        className="signup_container login_container"
        style={{ padding: "30px 60px" }}
      >
        <div className="login_design">
          <img src={loginImage} className="login_image" alt="login_image" />
        </div>

        <div className="login_box">
          <h1>Signup</h1>
          <p>Join now to buy and sell</p>
          <form
            className="login_fields"
            onSubmit={handleSubmit((data) => mutate(data))}
          >
            <div className="input_fullname field">
              <label htmlFor="fullname">Full Name </label>
              <input type="text" name="fullname" {...register("fullName")} />
            </div>

            <div className="input_email field">
              <label htmlFor="email">Email </label>
              <input
                type="text"
                name="email"
                placeholder="example@example.com"
                {...register("email")}
              />
            </div>

            <div className="input_phone field">
              <label htmlFor="phone">Mobile Number </label>
              <input type="text" name="phone" {...register("mobileNumber")} />
            </div>

            <div className="input_password field">
              <label htmlFor="password">Password </label>
              <input
                type="password"
                name="password"
                {...register("password")}
              />
            </div>

            <div className="submit_btn">
              <button className="btn" type="submit" disabled={isPending}>
                {isPending ? "Loading..." : "Signup"}
              </button>
            </div>
          </form>

          <div className="login_link">
            Already have an account? <Link to="/login">Log In</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;
