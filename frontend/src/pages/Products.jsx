import React, { useEffect, useState } from "react";

import ProductCard from "../components/rest-comp/ProductCard";
import {  productEndpoints } from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnector";
import { setLoading } from "../slices/authSlice";
import toast from "react-hot-toast";
import ProductSidebar from "../components/rest-comp/ProductSidebar";
import { setProductData } from "../slices/productSlice";
import { useNavigate } from "react-router-dom";

const { getAllProduct } = productEndpoints;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading)

  const navigate = useNavigate();

  const categories = useSelector(state => state.filters.categories);
  const gender = useSelector(state => state.filters.gender);
  const material = useSelector(state => state.filters.material);
  const color = useSelector(state => state.filters.color);
  const size = useSelector(state => state.filters.size);
  const filters = useSelector(state => state.filters);

  const search = useSelector(state => state.search.searchData);

  const [currentPage, setCurrentPage] = useState(1);
const productsPerPage = 30;

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
      console.log(res)
      setProducts(res.data.products);
     
      toast.success("Products loaded!");
    } catch {
      toast.error("Unable to fetch products");
    } finally {
      dispatch(setLoading(false));
    }
  };

  

  useEffect(() => {
    getAllProducts()
  }, []);

  // Add this useEffect after your state declarations
useEffect(() => {
  // Check if all filters and search are empty
  const areFiltersEmpty = 
    categories.length === 0 && 
    gender.length === 0 && 
    material.length === 0 && 
    color.length === 0 && 
    size.length === 0 && 
    filters.priceRanges.length === 0 && // Updated this line
    !search;

  // If all filters are empty, show all products
  if (areFiltersEmpty) {
    setFilteredProducts(products);
    return;
  }

  // Apply filters if any are active
  let filtered = [...products];

  if (categories.length > 0) {
    filtered = filtered.filter(product => 
      categories.includes(product.category.name)
    );
  }

  if (gender.length > 0) {
    filtered = filtered.filter(product => 
      gender.includes(product.gender)
    );
  }

  if (material.length > 0) {
    filtered = filtered.filter(product => 
      material.includes(product.material)
    );
  }

  if (color.length > 0) {
    filtered = filtered.filter(product => 
      color.includes(product.color)
    );
  }

  if (size.length > 0) {
    filtered = filtered.filter(product => 
      size.includes(product.size)
    );
  }

  // Updated price range filter
  if (filters.priceRanges.length > 0) {
    filtered = filtered.filter(product =>
      filters.priceRanges.some(
        range => product.price >= range.min && product.price <= range.max
      )
    );
  }
  
  if (search) {
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  setFilteredProducts(filtered);
  setCurrentPage(1);
}, [products, categories, gender, material, color, size, search, filters.priceRanges]);

  return (
    <div className="flex flex-col lg:flex-row bg-black min-h-screen text-[#FFD700]">
      <ProductSidebar /> 
      <main className="flex-1 p-6">
       <h1 className="text-2xl font-bold mb-6">Products:</h1>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {paginatedProducts.map(prod => (
    <ProductCard key={prod._id} product={prod}   />
  ))}
</div>

{/* Pagination */}
<div className="flex justify-center items-center mt-8 gap-2 text-[#FFD700]">
  {[...Array(totalPages)].map((_, i) => (
    <button
      key={i}
      className={`px-3 py-1 border border-[#FFD700] rounded ${
        currentPage === i + 1 ? "bg-[#FFD700] text-black" : "bg-black"
      }`}
      onClick={() => handlePageChange(i + 1)}
    >
      {i + 1}
    </button>
  ))}
</div>

      </main>
    </div>
  );
};

export default Products;