import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import axiosInstance from "../../utils/axiosInstance";
import AddressCard from "./AddressCard";
import { setAddress } from "../../store/userSlice";
import Loading from "../../utils/Loading";

import "../../style/profileAddressContainer.css";

const ProfileAddressContainer = () => {
  const address = useSelector((state) => state.user.address);
  const userId = useSelector((state) => state.auth.userId);
  const dispatch = useDispatch();

  // send a request to fetch user's addresses
  const { data, isLoading, isError } = useQuery({
    queryKey: ["addresses", userId],
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;
      if (!id) throw new Error("User ID is missing");

      const response = await axiosInstance.get(`/profile/address/${id}`);
      return response.data;
    },
    enabled: !!userId,
  });

  // update the address state with the fetched data to redux store
  useEffect(() => {
    if (data?.data) {
      dispatch(setAddress(data.data));
    }
  }, [data, dispatch]);

  return (
    <section className="address_container">
      <h1>Your Addresses</h1>

      {isLoading && <Loading />}
      {isError && (
        <p className="error_msg">Failed to load addresses. Please try again.</p>
      )}

      <div className="address_cards">
        <Link className="add_address_icon" to="/profile/addaddress">
          +
        </Link>

        {address && address.length > 0 ? (
          address.map((addr, idx) => <AddressCard key={idx} {...addr} />)
        ) : (
          <strong className="no_address_box">No Address Found</strong>
        )}
      </div>
    </section>
  );
};

export default ProfileAddressContainer;
