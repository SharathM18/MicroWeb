import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import axiosInstance from "../../utils/axiosInstance";
import axiosInstanceOrder from "../../utils/axiosInstanceOrder";

import Loading from "../../utils/Loading";
import AddressSelect from "./AddressSelect";
import SelectedProduct from "./SelectedProduct";

import "../../style/BuyProduct.css";

const BuyProduct = () => {
  const navigate = useNavigate();
  const { state: buyProductData } = useLocation();
  const userId = useSelector((state) => state.auth.userId);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(buyProductData.price);
  const queryClient = useQueryClient();
  const orderData = {
    product: {
      productId: buyProductData._id,
      selectedQuantity,
      totalPrice,
    },

    sellerId: buyProductData.sellerId,
    userId,
    shippingAddress: selectedAddressId,
  };

  // sends a request to fetch the addresses of the user
  const { data, isLoading, isError } = useQuery({
    queryKey: ["addresses", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is missing");
      const response = await axiosInstance.get(`/profile/address/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstanceOrder.post(`/order/buy/${userId}`, {
        data,
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["products"]);
      navigate("/payment");
      toast.success(data.message || "Order placed successfully", {
        duration: 3000,
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to place order", {
        duration: 3000,
      });
    },
  });

  return (
    <>
      <section className="buy_product_container">
        <h1>Buying Product</h1>
        <p>Great choice! Get ready to enjoy your purchase.</p>
        <div className="product_box">
          <h1>Select a Quantity </h1>
          <SelectedProduct
            buyProductData={buyProductData}
            setSelectedQuantity={setSelectedQuantity}
            totalPrice={totalPrice}
            setTotalPrice={setTotalPrice}
          />
        </div>
        <div className="select_address">
          <div className="select_address_header">
            <h1>Select Shipping Address</h1>
            <button
              className="btn"
              onClick={() => navigate("/profile/addaddress")}
            >
              +
            </button>
          </div>
          <div className="select_address_box">
            {isLoading && <Loading />}
            {isError && (
              <p className="error_msg">
                Failed to load addresses. Please try again.
              </p>
            )}
            {/* addresses */}
            {data?.data?.length > 0 ? (
              data.data.map((address) => (
                <AddressSelect
                  key={address._id}
                  address={address}
                  isSelected={selectedAddressId === address._id}
                  onSelect={() => setSelectedAddressId(address._id)}
                />
              ))
            ) : (
              <div className="no_address">
                <p className="error_msg ">No address found.</p>
                <button
                  className="btn"
                  onClick={() => navigate("/profile/addaddress")}
                >
                  Add Address
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="final_stage">
          <p>Total Price: {totalPrice}</p>
          <button className="btn" onClick={() => mutate(orderData)}>
            {isPending ? "Order Processing..." : "Proceed to Pay"}
          </button>
        </div>
      </section>
    </>
  );
};

export default BuyProduct;
