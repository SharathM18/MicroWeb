import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Loading from "../../utils/Loading";
import axiosInstanceOrder from "../../utils/axiosInstanceOrder";
import axiosInstance from "../../utils/axiosInstance";
import { setCartCount } from "../../store/cartCount";
import AddressSelect from "./AddressSelect";

import "../../style/cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);
  const [shippingAddressId, setShippingAddressId] = useState(null);
  const queryClient = useQueryClient();

  const [deletingId, setDeletingId] = useState(null);
  const [quantities, setQuantities] = useState({});

  // Fetch cart products
  const {
    data: cartProd,
    isPending,
    error,
  } = useQuery({
    queryKey: ["cart", userId],
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;
      const response = await axiosInstanceOrder.get(`/addtocart/${id}`);
      return response.data;
    },
    enabled: !!userId,
  });

  const cartProducts = cartProd?.data || [];

  // Initialize quantities
  useEffect(() => {
    if (cartProducts.length > 0) {
      const initialQuantities = {};
      cartProducts.forEach((product) => {
        initialQuantities[product._id] = 1;
      });
      setQuantities(initialQuantities);
    }
  }, [cartProducts]);

  useEffect(() => {
    dispatch(setCartCount(cartProducts.length));
  }, [cartProducts, dispatch]);

  // Delete product from cart
  const { mutate: deleteCartProduct } = useMutation({
    mutationFn: async (id) => {
      setDeletingId(id);
      const response = await axiosInstanceOrder.delete(
        `/addtocart/delete/${id}`
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["cart"]);
      toast.success(data.message || "Product removed from cart successfully", {
        duration: 3000,
      });
      setDeletingId(null);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Error removing product from cart",
        { duration: 3000 }
      );
      setDeletingId(null);
    },
  });

  // Get user addresses
  const { data, isLoading, isError } = useQuery({
    queryKey: ["addressess", userId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/profile/address/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });

  const handleQuantityChange = (productId, selectedQty) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: selectedQty,
    }));
  };

  const totalPrice = cartProducts.reduce((acc, product) => {
    const qty = quantities[product._id] || 1;
    return acc + product.price * qty;
  }, 0);

  const { mutate: checkoutMutation, isPending: isCheckoutPending } =
    useMutation({
      mutationFn: async () => {
        if (!shippingAddressId) {
          throw new Error(
            "Please select a shipping address before proceeding."
          );
        }

        // 1. Place orders for each product
        const orderRequests = cartProducts.map((product) => {
          const qty = quantities[product._id] || 1;

          const payload = {
            data: {
              product: {
                productId: product._id,
                selectedQuantity: qty,
                totalPrice: product.price * qty,
              },
              sellerId: product.sellerId,
              userId: userId,
              shippingAddress: shippingAddressId,
            },
          };

          return axiosInstanceOrder.post(`/order/buy/${userId}`, payload);
        });

        // Wait for all orders to be placed
        const responses = await Promise.all(orderRequests);

        // 2. Delete all cart items
        const deleteResponse = await axiosInstanceOrder.delete(
          `/cart/deleteall/${userId}`
        );

        return {
          orderResponses: responses,
          deleteResponse: deleteResponse.data,
        };
      },

      onSuccess: ({ orderResponses, deleteResponse }) => {
        toast.success("All orders placed successfully!", {
          duration: 3000,
        });

        // Refetch the cart to update UI
        queryClient.invalidateQueries(["cart"]);

        // Optional: Also reset cart count in Redux if you're tracking it
        dispatch(setCartCount(0));

        // Redirect to orders page
        navigate("/payment");
      },

      onError: (error) => {
        toast.error(
          error?.response?.data?.message ||
            error.message ||
            "Checkout failed. Try again.",
          {
            duration: 3000,
          }
        );
      },
    });

  if (isPending) return <Loading />;

  if (error)
    return <p className="error_msg">Error fetching cart: {error.message}</p>;

  return (
    <section className="cart">
      <div className="cart_header">
        <h1>Shopping Cart</h1>
        {cartProducts.length > 0 ? (
          <p>Almost there! Complete your purchase now.</p>
        ) : (
          <p>Your cart is waiting for something awesome!</p>
        )}
      </div>

      {cartProducts.length === 0 ? (
        <p className="error_msg cart_no_products">
          Your cart’s empty... but not for long! Start exploring now.
        </p>
      ) : (
        <>
          <div className="cart_table">
            <table>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cartProducts.map((product) => (
                  <tr key={product._id}>
                    <td>{product.title}</td>
                    <td>
                      <select
                        name="stock"
                        id="stock"
                        value={quantities[product._id] || 1}
                        onChange={(e) =>
                          handleQuantityChange(
                            product._id,
                            parseInt(e.target.value)
                          )
                        }
                      >
                        {Array.from({ length: product.stock }).map((_, idx) => (
                          <option value={idx + 1} key={idx}>
                            {idx + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      ₹{" "}
                      {(
                        product.price * (quantities[product._id] || 1)
                      ).toLocaleString()}
                    </td>
                    <td>
                      <button
                        className="btn"
                        onClick={() => deleteCartProduct(product.cartId)}
                        disabled={deletingId === product.cartId}
                      >
                        {deletingId === product.cartId
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Address Selection */}
          <p className="cart_address">
            <strong>Select Shipping Address</strong>
          </p>
          <div className="select_address_box cart_address_container">
            {isLoading && <Loading />}
            {isError && (
              <p className="error_msg">
                Failed to load addresses. Please try again.
              </p>
            )}
            {data?.data?.length > 0 ? (
              data.data.map((address) => (
                <AddressSelect
                  key={address._id}
                  address={address}
                  isSelected={shippingAddressId === address._id}
                  onSelect={() => setShippingAddressId(address._id)}
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

          {/* Total Price Section */}
          <div className="cart_total">
            <h3>Total: ₹ {totalPrice.toLocaleString()}</h3>
            <button
              className="btn checkout_btn"
              onClick={() => checkoutMutation()}
              disabled={cartProducts.length === 0 || isCheckoutPending}
            >
              {isCheckoutPending ? "Placing Orders..." : "Proceed to Checkout"}
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default Cart;
