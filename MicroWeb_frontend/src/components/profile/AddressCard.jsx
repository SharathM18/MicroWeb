import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "../../style/addressCard.css";
import { toast } from "sonner";

const AddressCard = (props) => {
  const userId = useSelector((state) => state.auth.userId);
  const navigate = useNavigate();
  const {
    _id,
    fullName,
    addressLineOne,
    addressLineTwo,
    city,
    state,
    pincode,
    country,
    phoneNumber,
    createdAt,
    modifiedAt,
  } = props;

  const queryClient = useQueryClient();

  // sends a delete request to delete address
  const { mutate, isPending } = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstance.delete(
        `/profile/address/delete/${userId}/${id}`
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["addresses", userId]);
      toast.success(data.message || "Address deleted successfully!");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage, { duration: 3000 });
    },
  });

  // date formatting function
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-us", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  return (
    <>
      <section className="address_box">
        <h1>{fullName}</h1>
        <p>{addressLineOne}</p>
        <p>{addressLineTwo}</p>
        <p>
          <span>{city}</span>, <span>{state}</span> - <span>{pincode}</span>
        </p>
        <p>{country}</p>
        <p>Phone Number: {phoneNumber}</p>
        <div className="action">
          {/* edit button */}
          <button
            className="btn"
            disabled={isPending}
            onClick={() =>
              navigate(`/profile/updateaddress/${_id}`, { state: props })
            }
          >
            Edit
          </button>

          <span className="action_dates">
            <p>Added on {formatDate(createdAt)} </p>
            <p>Last modified {formatDate(modifiedAt)} </p>
          </span>

          {/* remove button */}
          <button
            className="btn"
            disabled={isPending}
            onClick={() => mutate(_id)}
          >
            {isPending ? "Remove..." : "Remove"}
          </button>
        </div>
      </section>
    </>
  );
};

export default AddressCard;
