import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../slices/authSlice";
import { apiConnector } from "../services/apiConnector";
import { categoryEndpoints, productEndpoints } from "../services/api";
import toast from "react-hot-toast";

const { getAllCategory } = categoryEndpoints;
const { createProduct, getAllProduct, updateProduct } = productEndpoints;

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
    price: "",
    stock: "",
    sold: "",
    category: "",
    brand: "",
    gender: "",
    material: "",
    color: "",
    size: "",
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
      setProducts(res.data.products);
      setFiltered(res.data.products);
      toast.success("Products loaded!");
    } catch {
      toast.error("Unable to fetch products");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getAllCategories();
    getAllProducts();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    if (Array.isArray(products)) {
      const filteredProducts = products.filter((prod) =>
        `${prod.name} ${prod.stock} ${prod.sold} ${prod.category?.name} ${prod.brand}`
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

  const handleAddMoreImages = () => {
    setImageInputs((prev) => [...prev, prev.length]);
  };

  // Update the handleSubmit function to properly handle numeric values
  const handleSubmit = async (edit = false) => {
    try {
      dispatch(setLoading(true));
      const payload = new FormData();

      // Convert numeric strings to numbers before sending
      const numericFields = ['price', 'stock', 'sold'];
      
      Object.entries(formData).forEach(([key, value]) => {
        if (numericFields.includes(key)) {
          // Convert to number and validate
          const numValue = Number(value);
          if (isNaN(numValue)) {
            throw new Error(`Invalid ${key} value`);
          }
          payload.append(key, numValue);
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

      console.log(response)

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
      name: prod.name,
      description: prod.description,
      price: prod.price,
      stock: prod.stock,
      sold: prod.sold,
      category: prod.category?._id,
      brand: prod.brand,
      gender: prod.gender,
      material: prod.material,
      color: prod.color,
      size: prod.size,
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
              price: "",
              stock: "",
              sold: "",
              category: "",
              brand: "",
              gender: "",
              material: "",
              color: "",
              size: "",
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
                <th className="px-4 py-2 hidden lg:table-cell text-left">Stock</th>
                <th className="px-4 py-2 hidden lg:table-cell text-left">Sold</th>
                <th className="px-4 py-2 hidden lg:table-cell text-left">Category</th>
                <th className="px-4 py-2 hidden lg:table-cell text-left">Brand</th>
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
                    <td className="px-4 hidden lg:table-cell py-2">{prod.stock}</td>
                    <td className="px-4 hidden lg:table-cell py-2">{prod.sold}</td>
                    <td className="px-4 hidden lg:table-cell py-2">{prod.category?.name}</td>
                    <td className="px-4 hidden lg:table-cell py-2">{prod.brand}</td>
                    <td className="px-4 py-2">
                      <button
                        className="bg-[#FFD770] text-black px-3 py-1 rounded hover:brightness-110"
                        onClick={() => handleEditOpen(prod)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
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
          <div className="bg-white p-6 rounded-lg max-w-md w-[90%] overflow-y-auto max-h-[90vh] text-black">
            <h3 className="text-xl font-semibold mb-4">
              {showAddModal ? "Add Product" : "Edit Product"}
            </h3>

            {["name", "price", "stock", "sold", "brand", "material",              "gender", "color", "size"].map((key) => (
                <input
                  key={key}
                  type={
                    ["price", "stock", "sold"].includes(key) ? "number" : "text"
                  }
                  min={["price", "stock", "sold"].includes(key) ? "0" : undefined}
                  step={key === "price" ? "0.01" : "1"}
                  placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                  value={formData[key]}
                  onChange={(e) =>
                    setFormData({ ...formData, [key]: e.target.value })
                  }
                  className="mb-3 w-full p-2 border rounded"
                />
              ))}

              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
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

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="mb-3 w-full p-2 border rounded"
              />

              {/* Dynamic Image Upload */}
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
