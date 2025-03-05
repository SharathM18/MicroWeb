import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import axiosInstanceProducts from "../../utils/axiosInstanceProducts";

import "../../style/addProduct.css";
import "../../style/category.css";

// Define the product schema for validation
const productSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  price: z.string().optional(),
  stock: z.string().optional(),
  categoryId: z.string().optional(),
  images: z.array(z.instanceof(File)).optional(),
});

const AddProduct = () => {
  const navigate = useNavigate();
  const sellerId = useSelector((state) => state.auth.userId);
  const queryClient = useQueryClient();
  const [imagePreviews, setImagePreviews] = useState([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  // send the product data to the server as a FormData object (mmultipart/form-data)
  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData(); // Create a FormData object

      // Append all fields to the FormData object
      formData.append("sellerId", sellerId);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("stock", data.stock);
      formData.append("categoryId", data.categoryId);

      // Append each image file
      data.images.forEach((image) => {
        formData.append("images", image);
      });

      // Send the FormData object
      const response = await axiosInstanceProducts.post(
        "/myproducts/addproduct",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the correct content type
          },
        }
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("products");
      toast.success(data.message || "Product added successfully!", {
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

  // Fetch the categories from the server
  const { data } = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const response = await axiosInstanceProducts.get("/category");
      return response.data;
    },
  });

  // Handle image selection and preview
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);

    if (files.length > 0) {
      setValue("images", files); // Register images in react-hook-form
      const previews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  return (
    <section className="add_product_container">
      <h1>Add Product</h1>
      <p>Boost your business—list your product and start selling today!</p>
      <form
        className="product_form_container"
        onSubmit={handleSubmit((data) => mutate(data))}
      >
        {/* Image Preview */}
        <div className="preview_image">
          {imagePreviews.length > 0 ? (
            imagePreviews.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`Preview ${idx}`}
                className="preview-img"
              />
            ))
          ) : (
            <p>No images selected</p>
          )}
        </div>
        <div className="product_form">
          {/* Image upload */}
          <div className="field">
            <label>Images:</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </div>

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
              {isPending ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default AddProduct;
