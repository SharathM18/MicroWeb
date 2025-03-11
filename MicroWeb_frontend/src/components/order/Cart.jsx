import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useEffect, useState } from "react";

import Loading from "../../utils/Loading";

import axiosInstanceOrder from "../../utils/axiosInstanceOrder";
import { setCartCount } from "../../store/cartCount";

import "../../style/cart.css";

const Cart = () => {
  const userId = useSelector((state) => state.auth.userId);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [deletingId, setDeletingId] = useState(null);

  // Fetch cart products
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["cart", userId],
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;
      const response = await axiosInstanceOrder.get(`/addtocart/${id}`);
      return response.data;
    },
    enabled: !!userId,
  });

  const cartProducts = data?.data || [];

  // Update cart count whenever cartProducts changes
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
        {
          duration: 3000,
        }
      );
      setDeletingId(null);
    },
  });

  // Calculate total price
  const totalPrice = cartProducts.reduce((acc, curr) => acc + curr.price, 0);

  if (isPending) {
    return <Loading />;
  }

  if (isError) {
    return <p className="error_msg">Error fetching cart: {error.message}</p>;
  }

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
          <table>
            <thead>
              <tr>
                {/* <th>Image</th> */}
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartProducts.map((product) => (
                <tr key={product._id}>
                  {/* <td>
                    <img src={product.images[0]} alt={product.title} />
                  </td> */}
                  <td>{product.title}</td>
                  <td>
                    {Array.from({ length: product.stock }).map((stock, idx) => (
                      <p key={idx}>{idx}</p>
                    ))}
                  </td>
                  <td>₹ {product.price.toLocaleString()}</td>
                  <td>
                    <button
                      className="btn"
                      onClick={() => deleteCartProduct(product.cartId)}
                      disabled={deletingId === product.cartId}
                    >
                      {deletingId === product.cartId ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total Price Section */}
          <div className="cart_total">
            <h3>Total: ₹ {totalPrice.toLocaleString()}</h3>
            <button className="btn checkout_btn">Proceed to Checkout</button>
          </div>
        </>
      )}
    </section>
  );
};

export default Cart;
