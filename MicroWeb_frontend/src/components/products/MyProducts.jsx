import { useQueries } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";

import axiosInstanceProducts from "../../utils/axiosInstanceProducts";

import Loading from "../../utils/Loading";
import ProductCard from "./ProductCard";

import "../../style/product.css";

const MyProducts = () => {
  const sellerId = useSelector((state) => state.auth.userId);
  const [searchParams, setSearchParams] = useSearchParams();
  const sortValue = searchParams.get("sort") || "";
  const categoryId = searchParams.get("category") || "";

  // Fetch categories and products
  const [
    { data: categories, isLoading: isCategoriesLoading },
    { data: products, isLoading: isProductsLoading },
  ] = useQueries({
    queries: [
      // Fetch categories
      {
        queryKey: ["category"],
        queryFn: async () => {
          const response = await axiosInstanceProducts.get("/category");
          return response.data;
        },
      },
      // Fetch products by passing params for sorting and category
      {
        queryKey: ["products", sortValue, categoryId, sellerId],
        queryFn: async ({ queryKey }) => {
          const [, sortValue, categoryId, sellerId] = queryKey;
          const response = await axiosInstanceProducts.get(
            `/myproducts/${sellerId}`,
            {
              params: { sortValue: sortValue, categoryId: categoryId },
            }
          );
          return response.data;
        },
      },
    ],
  });

  // Handle sorting changes
  const handleSortChanges = (e) => {
    const selectedSort = e.target.value;
    setSearchParams({
      ...Object.fromEntries(searchParams),
      sort: selectedSort, // Use "sort" as the URL parameter
    });
  };

  // Handle category changes
  const handleCategoryChanges = (selectedCategoryId) => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      category: selectedCategoryId, // Use "category" as the URL parameter
    });
  };

  return (
    <>
      <div className="product_container">
        {/* Category */}
        <div className="categories">
          <h2>Categories</h2>
          <div className="category">
            <p
              onClick={() => handleCategoryChanges("")}
              className={categoryId === "" ? "category_active" : ""}
            >
              All Categories
            </p>
            {categories?.data?.categories.map((cat, idx) =>
              isCategoriesLoading ? (
                <p key={1000}>Loading...</p>
              ) : (
                <p
                  key={idx}
                  onClick={() => handleCategoryChanges(cat._id)}
                  className={categoryId === cat._id ? "category_active" : ""}
                >
                  {cat.name}
                </p>
              )
            )}
          </div>
        </div>

        {/* Products */}
        <div className="product_list">
          {/* product header */}
          <div className="product_list_header">
            <h2>Products</h2>
            <select
              name="sort"
              id="sort"
              className="products_sorting"
              value={sortValue}
              onChange={handleSortChanges}
            >
              <option value="">Relevance</option>
              <option value="desc">Price HIGH TO LOW</option>
              <option value="asc">Price LOW TO HIGH</option>
            </select>
          </div>

          {/* product cards */}
          {isProductsLoading ? (
            <Loading />
          ) : (
            <div className="product_card_container">
              {products?.data?.products?.length === 0 ? (
                <p className="no_products">
                  You haven&apos;t added any products in this category yet.
                  Start listing to attract buyers!
                </p>
              ) : (
                products?.data?.products?.map((product, idx) => (
                  <ProductCard {...product} key={idx} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyProducts;
