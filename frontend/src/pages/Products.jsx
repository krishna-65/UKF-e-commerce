import React, { useEffect, useState } from "react";
import ProductCard from "../components/rest-comp/ProductCard";
import ProductSidebar from "../components/rest-comp/ProductSidebar";
import { productEndpoints } from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnector";
import { setLoading } from "../slices/authSlice";
import { toast } from "react-hot-toast";

const { getAllProduct } = productEndpoints;

const Products = () => {
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [animateFilters, setAnimateFilters] = useState(false);
  const productsPerPage = 20;

  const loading = useSelector((state) => state.auth.loading);
  const categories = useSelector((state) => state.filters.categories);
  const gender = useSelector((state) => state.filters.gender);
  const material = useSelector((state) => state.filters.material);
  const color = useSelector((state) => state.filters.color);
  const size = useSelector((state) => state.filters.size);
  const filters = useSelector((state) => state.filters);
  const season = useSelector((state) => state.filters.season);
  const search = useSelector((state) => state.search.searchData);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNum) => {
    // Add exit animation before changing page
    setShowProducts(false);
    
    setTimeout(() => {
      setCurrentPage(pageNum);
      setShowProducts(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
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
    // Initial animations
    setTimeout(() => setIsVisible(true), 100);
    setTimeout(() => setAnimateFilters(true), 300);
  }, []);

  useEffect(() => {
    const areFiltersEmpty =
      categories.length === 0 &&
      gender.length === 0 &&
      material.length === 0 &&
      season.length === 0 &&
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
    if (season.length > 0) {
      filtered = filtered.filter((product) => season.includes(product.season));
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

    // Animate filter changes
    setShowProducts(false);
    setTimeout(() => {
      setFilteredProducts(filtered);
      setCurrentPage(1);
      setShowProducts(true);
    }, 200);
  }, [products, categories, gender, season, material, color, size, search, filters.priceRanges]);

  useEffect(() => {
    // Animate products when they load
    if (filteredProducts.length > 0 && !loading) {
      setShowProducts(true);
    }
  }, [filteredProducts, loading]);

  return (
    <div className="flex flex-col lg:flex-row bg-black text-[#FFD700] min-h-screen">
      {/* Animated Sidebar */}
      <div className={`fixed top-0 left-0 lg:relative z-50  transition-all duration-700 ease-out ${animateFilters ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}>
        <ProductSidebar />
      </div>

      {/* Main Content - Products */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8 relative z-0">
        {/* Animated Header */}
        <h1 className={`text-2xl font-bold mb-6 transition-all duration-800 hover:text-yellow-300 hover:scale-105 cursor-default ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}>
          Explore Products
          <div className="h-1 bg-gradient-to-r from-[#FFD700] to-transparent mt-2 transform origin-left transition-transform duration-500 scale-x-0 group-hover:scale-x-100"></div>
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-[50vh]">
            <div className="relative">
              {/* Enhanced Loading Animation */}
              <div className="w-16 h-16 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
              <div className="absolute top-2 left-2 w-12 h-12 border-4 border-yellow-300/20 border-t-yellow-300 rounded-full animate-spin animate-reverse"></div>
              <div className="absolute top-4 left-4 w-8 h-8 border-4 border-yellow-200/10 border-t-yellow-200 rounded-full animate-spin"></div>
              <div className="mt-4 text-center text-yellow-400 animate-pulse">Loading...</div>
            </div>
          </div>
        ) : (
          <>
            {/* Products Grid with Staggered Animation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map((prod, index) => (
                <div
                  key={prod._id}
                  className={`transition-all duration-700 ease-out transform hover:scale-105 hover:-translate-y-2 hover:shadow-2xl ${
                    showProducts 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-12 opacity-0'
                  }`}
                  style={{ 
                    transitionDelay: `${index * 100}ms`,
                    filter: showProducts ? 'none' : 'blur(4px)'
                  }}
                >
                  <div className="group relative overflow-hidden rounded-lg">
                    <ProductCard product={prod} />
                    {/* Hover Overlay Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced No Products Message */}
            {filteredProducts.length === 0 && !loading && (
              <div className={`flex flex-col items-center justify-center h-[40vh] transition-all duration-800 ${showProducts ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <div className="text-6xl mb-4 animate-bounce">😔</div>
                <div className="text-2xl font-semibold mb-2 text-yellow-400">No Products Found</div>
                <div className="text-gray-400 text-center max-w-md">
                  Try adjusting your filters or search terms to find what you're looking for.
                </div>
              </div>
            )}

            {/* Animated Pagination */}
            {totalPages > 1 && (
              <div className={`flex justify-center items-center mt-10 gap-2 flex-wrap transition-all duration-800 ${showProducts ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}>
                {/* Previous Button */}
                {currentPage > 1 && (
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-4 py-2 rounded-lg border border-[#FFD700] hover:bg-[#FFD700] hover:text-black transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-lg"
                  >
                    ←
                  </button>
                )}

                {/* Page Numbers */}
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = currentPage === pageNum;
                  
                  return (
                    <button
                      key={i}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-lg border transition-all duration-300 hover:scale-110 active:scale-95 transform ${
                        isActive
                          ? "bg-[#FFD700] text-black font-bold shadow-lg scale-110 border-[#FFD700]"
                          : "border-[#FFD700] hover:bg-[#FFD700] hover:text-black hover:shadow-lg"
                      }`}
                      style={{
                        animation: isActive ? 'pulse 2s infinite' : 'none'
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* Next Button */}
                {currentPage < totalPages && (
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-4 py-2 rounded-lg border border-[#FFD700] hover:bg-[#FFD700] hover:text-black transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-lg"
                  >
                    →
                  </button>
                )}
              </div>
            )}

            {/* Product Count Indicator */}
            <div className={`text-center mt-6 text-gray-400 transition-all duration-800 ${showProducts ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              Showing {paginatedProducts.length} of {filteredProducts.length} products
              {filteredProducts.length !== products.length && (
                <span className="text-yellow-400 ml-2">
                  (filtered from {products.length} total)
                </span>
              )}
            </div>
          </>
        )}
      </main>

      {/* Custom Styles for Enhanced Animations */}
      <style jsx>{`
        @keyframes reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        .animate-reverse {
          animation-direction: reverse;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        .group:hover .group-hover\\:scale-x-100 {
          transform: scaleX(1);
        }
      `}</style>
    </div>
  );
};

export default Products;