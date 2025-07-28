import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../slices/authSlice";
import { apiConnector } from "../services/apiConnector";
import {
  brandEndpoints,
  categoryEndpoints,
  productEndpoints,
} from "../services/api";
import toast from "react-hot-toast";

const { getAllCategory } = categoryEndpoints;
const { createProduct, getAllProduct, updateProduct, deleteProduct } =
  productEndpoints;
const { getAllBrands } = brandEndpoints;

const AddProduct = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    shortDescription: "",
    price: "",
    comparePrice: "",
    costPerItem: "",
    stock: "",
    category: "",
    subCategory: "",
    brand: "",
    size: "",
    color: "",
    material: "",
    fabric: "",
    fit: "",
    sleeveLength: "",
    pattern: "",
    occasion: "",
    season: "",
    gender: "",
    status: "active",
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    isOnSale: false,
    lookbookImages: [],
  });

  const [imageInputs, setImageInputs] = useState([0]);
  const [images, setImages] = useState({});

  const getAllCategories = async () => {
    try {
      dispatch(setLoading(true));
      const res = await apiConnector("GET", getAllCategory);
      setCategories(res.data);
      toast.success("Categories loaded!");
    } catch {
      toast.error("Unable to fetch categories");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getAllProducts = async () => {
    try {
      dispatch(setLoading(true));
      const res = await apiConnector("GET", getAllProduct);
      console.log("Products fetched :", res);
      setProducts(res.data.products);
      setFiltered(res.data.products);
      toast.success("Products loaded!");
    } catch {
      toast.error("Unable to fetch products");
    } finally {
      dispatch(setLoading(false));
    }
  };
  const [brands, setBrands] = useState([]);

  const fetchBrands = async () => {
    try {
      dispatch(setLoading(true));
      const res = await apiConnector("GET", getAllBrands);
      console.log("Brands fetched:", res);
      if (res.data.success) setBrands(res.data.brands);
    } catch {
      toast.error("Failed to load brands");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getAllCategories();
    getAllProducts();
    fetchBrands();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    if (Array.isArray(products)) {
      const filteredProducts = products.filter((prod) =>
        `${prod.name} ${prod.stock} ${prod.sold} ${prod.category?.name} ${prod.brand?.name}`
          .toLowerCase()
          .includes(term)
      );
      setFiltered(filteredProducts);
    }
  }, [searchTerm, products]);

  const handleSingleImageChange = (e, index) => {
    const file = e.target.files[0];
    setImages((prev) => ({ ...prev, [index]: file }));
  };

  const handleDeleteProduct = async (id) => {
    try {
      dispatch(setLoading(true));
      const confirm = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!confirm) return;

      const res = await apiConnector("DELETE", `${deleteProduct}${id}`);
      if (res.data.success) {
        toast.success("Product deleted successfully!");
        getAllProducts(); // Refresh table
      } else {
        toast.error("Deletion failed");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleAddMoreImages = () => {
    setImageInputs((prev) => [...prev, prev.length]);
  };

  const handleSubmit = async (edit = false) => {
    try {
      dispatch(setLoading(true));
      const payload = new FormData();
      const numericFields = ["price", "comparePrice", "costPerItem", "stock"];

      Object.entries(formData).forEach(([key, value]) => {
        if (numericFields.includes(key)) {
          const numVal = Number(value);
          if (isNaN(numVal)) throw new Error(`Invalid ${key} value`);
          payload.append(key, numVal);
        } else if (Array.isArray(value)) {
          value.forEach((v) => payload.append(key, v));
        } else {
          payload.append(key, value);
        }
      });

      Object.values(images).forEach((file) => {
        payload.append("images", file);
      });

      const endpoint = edit ? `${updateProduct}${editId}` : createProduct;
      const method = edit ? "PUT" : "POST";

      const response = await apiConnector(method, endpoint, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("response for submit is ", response);

      toast.success(edit ? "Product updated!" : "Product created!");
      setShowAddModal(false);
      setShowEditModal(false);
      setImageInputs([0]);
      setImages({});
      getAllProducts();
    } catch (err) {
      console.log(err);
      toast.error(err.message || "Operation failed!");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEditOpen = (prod) => {
    setEditId(prod._id);
    setFormData({
      ...formData,
      name: prod.name || "",
      description: prod.description || "",
      shortDescription: prod.shortDescription || "",
      price: prod.price || "",
      comparePrice: prod.comparePrice || "",
      costPerItem: prod.costPerItem || "",
      stock: prod.stock || "",
      category: prod.category?._id || "",
      subCategory: prod.subCategory || "",
      brand: prod.brand || "",
      size: prod.size || "",
      color: prod.color || "",
      material: prod.material || "",
      fabric: prod.fabric || "",
      fit: prod.fit || "",
      sleeveLength: prod.sleeveLength || "",
      pattern: prod.pattern || "",
      occasion: prod.occasion || "",
      season: prod.season || "",
      gender: prod.gender || "",
      status: prod.status || "active",
      isFeatured: prod.isFeatured || false,
      isNewArrival: prod.isNewArrival || false,
      isBestSeller: prod.isBestSeller || false,
      isOnSale: prod.isOnSale || false,
      lookbookImages: prod.lookbookImages || [],
    });
    setImages({});
    setImageInputs([0]);
    setShowEditModal(true);
  };

  return (
    <div className="lg:w-[calc(100vw-256px)] p-6 text-black overflow-y-auto h-[100vh]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Manage Products</h2>
        <button
          onClick={() => {
            setFormData({
              name: "",
              description: "",
              shortDescription: "",
              price: "",
              comparePrice: "",
              costPerItem: "",
              stock: "",
              category: "",
              subCategory: "",
              brand: "",
              size: "",
              color: "",
              material: "",
              fabric: "",
              fit: "",
              sleeveLength: "",
              pattern: "",
              occasion: "",
              season: "",
              gender: "",
              status: "active",
              isFeatured: false,
              isNewArrival: false,
              isBestSeller: false,
              isOnSale: false,
              lookbookImages: [],
            });
            setImages({});
            setImageInputs([0]);
            setShowAddModal(true);
          }}
          className="bg-[#FFD770] text-black px-4 py-2 rounded shadow-lg hover:brightness-110 transition"
        >
          + Add Product
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by name, category, brand..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 w-full p-2 border rounded"
      />

      {loading ? (
        <div className="w-full h-[50vh] flex justify-center items-center">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="lg:min-w-[700px] w-full bg-white rounded">
            <thead className="bg-[#FFD770]">
              <tr>
                <th className="px-4 py-2 text-left">Sr. No.</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 hidden lg:table-cell text-left">
                  Stock
                </th>
                <th className="px-4 py-2 hidden lg:table-cell text-left">
                  Category
                </th>
                <th className="px-4 py-2 hidden lg:table-cell text-left">
                  Brand
                </th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(filtered) && filtered.length > 0 ? (
                filtered.map((prod, idx) => (
                  <tr key={prod._id} className="border-t">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{prod.name}</td>
                    <td className="px-4 py-2">₹{prod.price}</td>
                    <td className="px-4 hidden lg:table-cell py-2">
                      {prod.stock}
                    </td>
                    <td className="px-4 hidden lg:table-cell py-2">
                      {prod.category?.name}
                    </td>
                    <td className="px-4 hidden lg:table-cell py-2">
                      {prod.brand?.name}
                    </td>
                    <td className="px-4 py-2 capitalize">{prod.status}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        className="bg-[#FFD770] text-black px-3 py-1 rounded hover:brightness-110"
                        onClick={() => handleEditOpen(prod)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => handleDeleteProduct(prod._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {(showAddModal || showEditModal) && (
        <div className="fixed z-[151] inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center">
          <div className="bg-[#111] text-[#FFD770] p-6 rounded-xl max-w-2xl w-[90%] hidescroll max-h-[90vh] overflow-y-auto shadow-[0_0_20px_rgba(255,215,112,0.3)] animate-fade-in border border-[#FFD770]/30 transition-all duration-300">
            <h3 className="text-2xl font-bold mb-6 text-center uppercase">
              {showAddModal ? "Add Product" : "Edit Product"}
            </h3>

            {/* Text Inputs */}
            {[
              "name",
              "shortDescription",
              "price",
              "comparePrice",
              "costPerItem",
              "stock",
              "color",
              "material",
              "fabric",
              "pattern",
              "occasion",
            ].map((key) => (
              <input
                key={key}
                type={
                  ["price", "stock", "comparePrice", "costPerItem"].includes(
                    key
                  )
                    ? "number"
                    : "text"
                }
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={formData[key]}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
                className="mb-4 w-full px-3 py-2 bg-black/30 text-[#FFD770] border border-[#FFD770]/40 rounded-md placeholder:text-[#FFD770]/60 focus:outline-none focus:border-[#FFD770]/80"
              />
            ))}

            {/* Dropdowns */}
            {[
              {
                label: "Size",
                value: formData.size,
                options: [
                  "XS",
                  "S",
                  "M",
                  "L",
                  "XL",
                  "XXL",
                  "XXXL",
                  "4XL",
                  "5XL",
                  "One Size",
                ],
                key: "size",
              },
              {
                label: "Fit",
                value: formData.fit,
                options: ["Slim", "Regular", "Oversized", "Relaxed"],
                key: "fit",
              },
              {
                label: "Sleeve Length",
                value: formData.sleeveLength,
                options: ["Short", "Half", "Long", "Sleeveless"],
                key: "sleeveLength",
              },
              {
                label: "Season",
                value: formData.season,
                options: ["Summer", "Winter", "Spring", "Fall", "All Season"],
                key: "season",
              },
              {
                label: "Gender",
                value: formData.gender,
                options: ["Men", "Women", "Unisex", "Kids", "Boys", "Girls"],
                key: "gender",
              },
            ].map((dropdown) => (
              <select
                key={dropdown.key}
                value={dropdown.value}
                onChange={(e) =>
                  setFormData({ ...formData, [dropdown.key]: e.target.value })
                }
                className="mb-4 w-full px-3 py-2 bg-black/30 text-[#FFD770] border border-[#FFD770]/40 rounded-md focus:outline-none"
              >
                <option value="">Select {dropdown.label}</option>
                {dropdown.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ))}

            {/* Brands */}
            <select
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              className="mb-4 w-full px-3 py-2 bg-black/30 text-[#FFD770] border border-[#FFD770]/40 rounded-md"
            >
              <option value="">Select Brand</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>

            {/* Category */}
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value,
                  subCategory: e.target.value,
                })
              }
              className="mb-4 w-full px-3 py-2 bg-black/30 text-[#FFD770] border border-[#FFD770]/40 rounded-md"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Description */}
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mb-4 w-full px-3 py-2 bg-black/30 text-[#FFD770] border border-[#FFD770]/40 rounded-md placeholder:text-[#FFD770]/60 focus:outline-none"
            />

            {/* Boolean Flags */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {["isFeatured", "isNewArrival", "isBestSeller", "isOnSale"].map(
                (flag) => (
                  <label key={flag} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData[flag]}
                      onChange={(e) =>
                        setFormData({ ...formData, [flag]: e.target.checked })
                      }
                    />
                    <span className="text-sm">{flag}</span>
                  </label>
                )
              )}
            </div>

            {/* Image Upload */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">Product Images</label>
              {imageInputs.map((key) => (
                <input
                  key={key}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSingleImageChange(e, key)}
                  className="mb-2 w-full px-3 py-2 bg-black/30 text-[#FFD770] border border-[#FFD770]/40 rounded-md"
                />
              ))}
              <button
                type="button"
                onClick={handleAddMoreImages}
                className="mt-2 px-4 py-2 bg-[#FFD770] text-black rounded hover:scale-105 transition"
              >
                + Add More Pics
              </button>
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
                className="px-4 py-2 bg-black/30 text-[#FFD770] border border-[#FFD770]/40 rounded hover:bg-[#FFD770]/10 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit(showEditModal)}
                className="px-4 py-2 w-[100px] flex justify-center items-center bg-[#FFD770] text-black rounded hover:scale-105 transition"
              >
                {loading ? (
                  <div className="loader1"></div>
                ) : showAddModal ? (
                  "Save"
                ) : (
                  "Update"
                )}
              </button>
            </div>
          </div>

          {/* Modal Animation */}
          <style jsx>{`
            @keyframes fade-in {
              from {
                opacity: 0;
                transform: scale(0.95);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            .animate-fade-in {
              animation: fade-in 0.3s ease-out;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
