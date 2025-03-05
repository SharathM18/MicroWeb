import { useQueries } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

import axiosInstanceProducts from "../../utils/axiosInstanceProducts";

import Loading from "../../utils/Loading";
import ProductCard from "./ProductCard";

import "../../style/product.css";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortValue = searchParams.get("sort") || "";
  const categoryId = searchParams.get("category") || "";

  const [
    { data: categories, isLoading: isCategoriesLoading },
    { data: products, isLoading: isProductsLoading },
  ] = useQueries({
    queries: [
      {
        queryKey: ["category"],
        queryFn: async () => {
          const response = await axiosInstanceProducts.get("/category");
          return response.data;
        },
      },
      {
        queryKey: ["products", sortValue, categoryId],
        queryFn: async () => {
          const response = await axiosInstanceProducts.get("/products", {
            params: { sortValue: sortValue, categoryId: categoryId },
          });
          return response.data;
        },
      },
    ],
  });

  const handleSortChanges = (e) => {
    const selectedSort = e.target.value;
    setSearchParams({
      ...Object.fromEntries(searchParams),
      sort: selectedSort, // Use "sort" as the URL parameter
    });
  };

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
                  Looks like we’re out of stock or don’t have an exact match.
                  Try a different category or browse our trending products!
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

export default Products;
