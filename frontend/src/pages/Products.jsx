import React, { useEffect, useState } from "react";
import ProductCard from "../components/rest-comp/ProductCard";
import ProductSidebar from "../components/rest-comp/ProductSidebar";
import { productEndpoints } from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnector";
import { setLoading } from "../slices/authSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const { getAllProduct } = productEndpoints;

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 20;

  const loading = useSelector((state) => state.auth.loading);

  const categories = useSelector((state) => state.filters.categories);
  const gender = useSelector((state) => state.filters.gender);
  const material = useSelector((state) => state.filters.material);
  const color = useSelector((state) => state.filters.color);
  const size = useSelector((state) => state.filters.size);
  const filters = useSelector((state) => state.filters);
  const search = useSelector((state) => state.search.searchData);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getAllProducts = async () => {
    try {
      dispatch(setLoading(true));
      const res = await apiConnector("GET", getAllProduct);
      setProducts(res.data.products || []);
      toast.success("Products loaded!");
    } catch {
      toast.error("Unable to fetch products");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  useEffect(() => {
    const areFiltersEmpty =
      categories.length === 0 &&
      gender.length === 0 &&
      material.length === 0 &&
      color.length === 0 &&
      size.length === 0 &&
      filters.priceRanges.length === 0 &&
      !search;

    if (areFiltersEmpty) {
      setFilteredProducts(products);
      return;
    }

    let filtered = [...products];

    if (categories.length > 0) {
      filtered = filtered.filter((product) =>
        categories.includes(product.category?.name)
      );
    }
    if (gender.length > 0) {
      filtered = filtered.filter((product) =>
        gender.includes(product.gender)
      );
    }
    if (material.length > 0) {
      filtered = filtered.filter((product) =>
        material.includes(product.material)
      );
    }
    if (color.length > 0) {
      filtered = filtered.filter((product) => color.includes(product.color));
    }
    if (size.length > 0) {
      filtered = filtered.filter((product) => size.includes(product.size));
    }
    if (filters.priceRanges.length > 0) {
      filtered = filtered.filter((product) =>
        filters.priceRanges.some(
          (range) =>
            product.price >= range.min && product.price <= range.max
        )
      );
    }
    if (search) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, categories, gender, material, color, size, search, filters.priceRanges]);

  return (
    <div className="flex flex-col lg:flex-row bg-black text-[#FFD700] min-h-screen">
      <ProductSidebar />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Explore Products</h1>

        {loading ? (
          <div className="flex justify-center items-center h-[50vh]">
            <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-10 gap-2 flex-wrap">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-2 rounded border transition duration-300 ${
                      currentPage === i + 1
                        ? "bg-[#FFD700] text-black font-bold"
                        : "border-[#FFD700] hover:bg-[#FFD700] hover:text-black"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Products;
