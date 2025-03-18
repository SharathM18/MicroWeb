import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import axiosInstanceProducts from "../../utils/axiosInstanceProducts";
import axiosInstanceOrder from "../../utils/axiosInstanceOrder";
import { setCartCount } from "../../store/cartCount";

import "../../style/productCard.css";

const ProductCard = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { _id, images, description, price, stock, title } = props;
  const userCurrentRole = useSelector(
    (state) => state.userRole.userCurrentRole
  );
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userId = useSelector((state) => state.auth.userId);

  const queryClient = useQueryClient();

  // send delete request to the server
  const { mutate, isPending } = useMutation({
    mutationFn: async (id) => {
      const response = await axiosInstanceProducts.delete(
        `/myproducts/deleteproduct/${id}`
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("products");
      toast.success(data.message || "Product deleted successfully!");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again. (frontend)";
      toast.error(errorMessage, { duration: 3000 });
    },
  });

  // sends a post request to the server to add the product to the cart
  const { mutate: addtocart, isPending: isAddtocart } = useMutation({
    mutationFn: async (cartDetails) => {
      console.log(cartDetails);
      const response = await axiosInstanceOrder.post("/addtocart", cartDetails);
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(setCartCount(data.cartCount));
      queryClient.invalidateQueries(["cart"]);
      toast.success(data.message || "Product added to cart!");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to add to cart. Please try again.";
      toast.error(errorMessage, { duration: 3000 });
    },
  });

  return (
    <>
      <article className="product_card">
        {/* preview image */}
        <div className="product_card_image">
          <img src={images[0]} alt={title} />
        </div>

        {/* product details */}
        <div className="product_card_details">
          <h1 className="product_card_title">{title}</h1>
          <p className="product_card_description">{description}</p>

          <div className="product_info">
            <h3 className="product_card_price">Price: {price}</h3>
            {isAuthenticated
              ? stock > 0 && <h3 className="stock">Stock: {stock}</h3>
              : null}
            <h3 className="stock">{stock > 0 ? "In stock" : "Out of stock"}</h3>
          </div>

          {isAuthenticated && userCurrentRole === "buyer" ? (
            // isAuthenticated and buyer btns
            <div className="product_btn">
              <button
                className="btn"
                onClick={() =>
                  !isAuthenticated
                    ? navigate("/login")
                    : stock === 0
                    ? toast.error("Out of Stock – Check back soon!")
                    : navigate(`/product/buyproduct/${_id}}`, { state: props })
                }
              >
                Buy
              </button>
              <button
                className="btn"
                onClick={() =>
                  !isAuthenticated
                    ? navigate("/login")
                    : stock === 0
                    ? toast.error("Sorry, this item can’t be added right now.")
                    : addtocart({
                        userId: userId,
                        productId: _id,
                      })
                }
              >
                {isAddtocart ? "Adding" : "Add to Cart"}
              </button>
            </div>
          ) : isAuthenticated && userCurrentRole === "seller" ? (
            // isAuthenticated and seller btns
            <div className="product_btn">
              <button
                className="btn"
                onClick={() =>
                  navigate(`/product/updateproduct/${_id}`, {
                    state: props,
                  })
                }
              >
                Edit
              </button>
              <button className="btn" onClick={() => mutate(_id)}>
                {isPending ? "Deleting" : "Delete"}
              </button>
            </div>
          ) : (
            // seller btns and isAuthenticated is false
            <div className="product_btn">
              <button
                className="btn"
                onClick={() => (!isAuthenticated ? navigate("/login") : null)}
              >
                Buy
              </button>
              <button
                className="btn"
                onClick={() => (!isAuthenticated ? navigate("/login") : null)}
              >
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </article>
    </>
  );
};

export default ProductCard;
