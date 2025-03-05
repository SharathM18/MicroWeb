import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSelector } from "react-redux";
import { toast } from "sonner";

import axiosInstance from "../../utils/axiosInstance";

import "../../style/addAddress.css";

import addressImage from "../../assets/images/undraw_delivery-address.svg";

// Define schema for address form validation
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

const UpdateAddress = () => {
  const { id } = useParams(); // Get address ID from URL
  const { state: addressData } = useLocation(); // Get address data from navigation state
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.userId);
  const queryClient = useQueryClient();

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: addressData || {}, // Pre-fill form with address data
  });

  // send a PUT request to update the address
  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstance.put(
        `/profile/address/update/${id}`,
        { userId: userId, ...data }
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["addresses", userId]); // Refresh address list
      toast.success(data.message || "Address updated successfully", {
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
    <section className="add_address_container">
      <div className="address_image">
        <img src={addressImage} alt="Address Image" />
      </div>

      <form
        className=" add_address_form"
        onSubmit={handleSubmit((data) => mutate(data))}
      >
        <div className="address_title">
          <h1>Update Address</h1>
          <p>Manage your shipping address easily</p>
        </div>

        <div className="merge_field">
          <div className="input_fullname field">
            <label htmlFor="fullName">Full Name</label>
            <input type="text" {...register("fullName")} />
          </div>

          <div className="input_phone_number field">
            <label htmlFor="phoneNumber">Phone number</label>
            <input type="text" {...register("phoneNumber")} />
          </div>
        </div>

        <div className="input_address_line_one field">
          <label htmlFor="addressLineOne">Address line 1</label>
          <input
            type="text"
            className="address_line_1"
            {...register("addressLineOne")}
          />
        </div>

        <div className="input_address_line_two field">
          <label htmlFor="addressLineTwo">Address line 2</label>
          <input
            type="text"
            className="address_line_2"
            {...register("addressLineTwo")}
          />
        </div>

        <div className="merge_field">
          <div className="input_city field">
            <label htmlFor="city">City</label>
            <input type="text" {...register("city")} />
          </div>

          <div className="input_state field">
            <label htmlFor="state">State</label>
            <input type="text" {...register("state")} />
          </div>
        </div>

        <div className="merge_field">
          <div className="input_pincode field">
            <label htmlFor="pincode">PIN Code</label>
            <input type="text" {...register("pincode")} />
          </div>

          <div className="input_country field">
            <label htmlFor="country">Country</label>
            <input type="text" {...register("country")} />
          </div>
        </div>

        <div className="submit_btn">
          <button type="submit" className="btn" disabled={isPending}>
            {isPending ? "Updating..." : "Update Address"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default UpdateAddress;
