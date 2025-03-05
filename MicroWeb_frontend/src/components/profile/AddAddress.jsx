import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";

import "../../style/addAddress.css";

import addressImage from "../../assets/images/undraw_delivery-address.svg";

// validation schema for add address form
const schema = z.object({
  country: z.string(),
  fullName: z.string(),
  addressLineOne: z.string(),
  addressLineTwo: z.string(),
  city: z.string(),
  state: z.string(),
  pincode: z.string(),
  phoneNumber: z.string(),
});

const AddAddress = () => {
  const userId = useSelector((state) => state.auth.userId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) });

  // const countryName = ["India"];

  // send a post request to add address
  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      console.log(data);
      const reponse = await axiosInstance.post("/profile/address/add", {
        userId: userId,
        ...data,
      });
      return reponse.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["userData", userId]);
      toast.success(data.message || "Address added successfully!", {
        duration: 3000,
      });

      navigate("/profile/address");
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
      <section className="add_address_container">
        <div className="address_image">
          <img src={addressImage} alt="Address Image" />
        </div>

        <form
          className="add_address_form"
          onSubmit={handleSubmit((data) => mutate(data))}
        >
          <div className="address_title">
            <h1>Add a new address</h1>
            <p>Manage your shipping address easily</p>
          </div>
          <div className="merge_field">
            <div className="input_fullname field">
              <label htmlFor="fullname">Full Name: </label>
              <input type="text" name="fullname" {...register("fullName")} />
            </div>

            <div className="input_phone_number field">
              <label htmlFor="phone_number">Phone number: </label>
              <input
                type="text"
                name="phone_number"
                {...register("phoneNumber")}
              />
            </div>
          </div>

          <div className="input_address_line_one field">
            <label htmlFor="address_line_one">Address line 1: </label>
            <input
              type="text"
              className="address_line_1"
              name="address_line_one"
              placeholder="Street address, P.O. box, company name, c/o"
              {...register("addressLineOne")}
            />
          </div>

          <div className="input_address_line_two field">
            <label htmlFor="address_line_two">Address line 2: </label>
            <input
              type="text"
              className="address_line_2"
              name="address_line_two"
              placeholder="Apartment, suite, unit, building, floor, etc."
              {...register("addressLineTwo")}
            />
          </div>

          <div className="merge_field">
            <div className="input_city field">
              <label htmlFor="city">City </label>
              <input type="text" name="city" {...register("city")} />
            </div>

            <div className="input_state field">
              <label htmlFor="state">State </label>
              <input type="text" name="state" {...register("state")} />
            </div>
          </div>

          <div className="merge_field">
            <div className="input_pincode field">
              <label htmlFor="pincode">PIN Code: </label>
              <input type="text" name="pincode" {...register("pincode")} />
            </div>

            <div className="input_country field">
              <label htmlFor="country">Country: </label>
              <input type="text" name="country" {...register("country")} />
            </div>
          </div>

          <div className="submit_btn">
            <button className="btn" type="submit" disabled={isPending}>
              {isPending ? "Loading..." : "Add address"}
            </button>
          </div>
        </form>
      </section>
    </>
  );
};

export default AddAddress;
