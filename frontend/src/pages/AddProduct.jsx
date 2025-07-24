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
        <div className="fixed z-[151] inset-0 backdrop-blur-2xl bg-opacity-30 flex justify-center items-center">
          <div className="bg-white hidecursor p-6 rounded-lg max-w-md w-[90%] overflow-y-auto max-h-[90vh] text-black">
            <h3 className="text-xl font-semibold mb-4">
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
                className="mb-3 w-full p-2 border rounded"
              />
            ))}

            {/* ENUM DROPDOWNS */}
            <select
              value={formData.size}
              onChange={(e) =>
                setFormData({ ...formData, size: e.target.value })
              }
              className="mb-3 w-full p-2 border rounded"
            >
              <option value="">Select Size</option>
              {[
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
              ].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            <select
              value={formData.fit}
              onChange={(e) =>
                setFormData({ ...formData, fit: e.target.value })
              }
              className="mb-3 w-full p-2 border rounded"
            >
              <option value="">Select Fit</option>
              {["Slim", "Regular", "Oversized", "Relaxed"].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            <select
              value={formData.sleeveLength}
              onChange={(e) =>
                setFormData({ ...formData, sleeveLength: e.target.value })
              }
              className="mb-3 w-full p-2 border rounded"
            >
              <option value="">Select Sleeve Length</option>
              {["Short", "Half", "Long", "Sleeveless"].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            <select
              value={formData.season}
              onChange={(e) =>
                setFormData({ ...formData, season: e.target.value })
              }
              className="mb-3 w-full p-2 border rounded"
            >
              <option value="">Select Season</option>
              {["Summer", "Winter", "Spring", "Fall", "All Season"].map(
                (opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                )
              )}
            </select>

            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="mb-3 w-full p-2 border rounded"
            >
              <option value="">Select Gender</option>
              {["Men", "Women", "Unisex", "Kids", "Boys", "Girls"].map(
                (opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                )
              )}
            </select>

            {/* <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="mb-3 w-full p-2 border rounded"
            >
              <option value="">Select Status</option>
              {["draft", "active", "archived"].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select> */}

            {/* Brands */}
            <select
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              className="mb-3 w-full p-2 border rounded"
            >
              <option value="">Select Brand</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>

            {/* Category & Subcategory */}
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value,
                  subCategory: e.target.value,
                })
              }
              className="mb-3 w-full p-2 border rounded"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* <input
        type="text"
        placeholder="Subcategory"
        value={formData.subCategory}
        onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
        className="mb-3 w-full p-2 border rounded"
      /> */}

            {/* Description */}
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mb-3 w-full p-2 border rounded"
            />

            {/* Boolean Flags */}
            {["isFeatured", "isNewArrival", "isBestSeller", "isOnSale"].map(
              (flag) => (
                <label key={flag} className="block mb-2">
                  <input
                    type="checkbox"
                    checked={formData[flag]}
                    onChange={(e) =>
                      setFormData({ ...formData, [flag]: e.target.checked })
                    }
                  />{" "}
                  {flag}
                </label>
              )
            )}

            {/* Lookbook Images
            <label className="block mt-4 mb-2 font-semibold">
              Lookbook Images (URLs)
            </label>
            {[0, 1].map((index) => (
              <input
                key={index}
                type="text"
                placeholder={`Lookbook Image ${index + 1}`}
                value={formData.lookbookImages[index] || ""}
                onChange={(e) => {
                  const updatedImages = [...formData.lookbookImages];
                  updatedImages[index] = e.target.value;
                  setFormData({ ...formData, lookbookImages: updatedImages });
                }}
                className="mb-2 w-full p-2 border rounded"
              />
            ))} */}

            {/* Image Upload */}
            <div className="mb-4">
              <label className="block font-medium mb-2">Product Images</label>
              {imageInputs.map((key) => (
                <input
                  key={key}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSingleImageChange(e, key)}
                  className="mb-2 w-full p-2 rounded border"
                />
              ))}
              <button
                type="button"
                onClick={handleAddMoreImages}
                className="px-4 py-2 bg-[#FFD700] text-black rounded mt-2 hover:brightness-110"
              >
                + Add More Pics
              </button>
            </div>

            {/* Modal Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSubmit(showEditModal)}
                className="px-4 py-2 w-[100px] flex justify-center items-center bg-[#FFD770] text-black rounded"
              >
                {loading ? (
                  <div className="loader1"></div>
                ) : (
                  <>{showAddModal ? "Save" : "Update"}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
