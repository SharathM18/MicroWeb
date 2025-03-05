import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axiosInstanceProducts from "../../utils/axiosInstanceProducts";

import "../../style/addproduct.css";
import "../../style/category.css";

const productSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.string().optional(),
  stock: z.string().optional(),
  categoryId: z.string().optional(),
  // images: z.array(z.instanceof(File)).optional(),
});

const UpdateProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const sellerId = useSelector((state) => state.auth.userId);
  const queryClient = useQueryClient();
  const { state: productData } = useLocation();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: productData || {},
  });

  // send request to update product
  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const response = await axiosInstanceProducts.put(
        `/myproducts/updateproduct/${productData._id}`,
        { sellerId: sellerId, ...data }
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("products");
      toast.success(data.message || "Product update successfully!", {
        duration: 3000,
      });
      navigate("/myproducts");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage, { duration: 3000 });
    },
  });

  // Fetch categories
  const { data } = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const response = await axiosInstanceProducts.get("/category");
      return response.data;
    },
  });

  return (
    <div className="add_product_container">
      <h1>Update Product</h1>
      <p>Keep your products up to date and attract more buyers!</p>
      <form
        className="product_form_container"
        onSubmit={handleSubmit((data) => mutate(data))}
      >
        {/* Image Preview */}
        <div className="preview_image">
          {productData.images.length > 0 ? (
            <img
              src={productData.images[0]}
              alt={productData.title}
              className="preview-img"
            />
          ) : (
            <p>No images selected</p>
          )}
        </div>

        <div className="product_form">
          {/* Title */}
          <div className="field">
            <label htmlFor="title">Title </label>
            <input type="text" name="title" {...register("title")} />
          </div>

          {/* Description */}
          <div className="field">
            <label>Description </label>
            <textarea {...register("description")} />
          </div>

          <div className="merge_field">
            {/* Stock */}
            <div className="field stock">
              <label>Stock </label>
              <input type="text" {...register("stock")} />
            </div>

            {/* Price */}
            <div className="field price">
              <label>Price </label>
              <input type="text" {...register("price")} />
            </div>

            {/* Category ID */}
            <div className="category_cell">
              <label>Category </label>
              <select className="category_field" {...register("categoryId")}>
                <option value="">Select a category</option>
                {data?.data.categories &&
                  data?.data.categories.map((category, idx) => (
                    <option value={category._id} key={idx}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="submit_btn">
            <button type="submit" className="btn" disabled={isSubmitting}>
              {isPending ? "Updating Product..." : "Update Product"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateProducts;
