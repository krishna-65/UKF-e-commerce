import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiConnector } from "../services/apiConnector";
import { setLoading } from "../slices/authSlice";
import { brandEndpoints } from "../services/api";
import toast from "react-hot-toast";

const { getAllBrands, createBrand, updateBrand, deleteBrand } = brandEndpoints;

const Brands = () => {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  const [brands, setBrands] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    logo: { url: "", altText: "" },
    website: "",
    isFeatured: false,
    status: "active",
    metaTitle: "",
    metaDescription: "",
    seoKeywords: "",
  });

  const fetchBrands = async () => {
    try {
      dispatch(setLoading(true));
      const res = await apiConnector("GET", getAllBrands);
      if (res.data.success) setBrands(res.data.brands);
    } catch {
      toast.error("Failed to load brands");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleEditOpen = (brand) => {
    setEditId(brand._id);
    setFormData({
      name: brand.name || "",
      slug: brand.slug || "",
      description: brand.description || "",
      logo: {
        url: brand.logo?.url || "",
        altText: brand.logo?.altText || "",
      },
      website: brand.website || "",
      isFeatured: brand.isFeatured || false,
      status: brand.status || "active",
      metaTitle: brand.metaTitle || "",
      metaDescription: brand.metaDescription || "",
      seoKeywords: brand.seoKeywords?.join(", ") || "",
    });
    setEditing(true);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditing(false);
    setEditId(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      logo: { url: "", altText: "" },
      website: "",
      isFeatured: false,
      status: "active",
      metaTitle: "",
      metaDescription: "",
      seoKeywords: "",
    });
  };

  const handleDelete = async (id) => {
  try {
    dispatch(setLoading(true));
    const confirmed = window.confirm("Are you sure you want to delete this brand?");
    if (!confirmed) return;

    const res = await apiConnector("DELETE", `${deleteBrand}${id}`);
    if (res.data.success) {
      toast.success("Brand deleted successfully");
      fetchBrands(); // Refresh list
    } else {
      toast.error("Deletion failed");
    }
  } catch (err) {
    console.log(err);
    toast.error(err.message || "Unable to delete");
  } finally {
    dispatch(setLoading(false));
  }
};


  const handleSave = async () => {
    try {
      dispatch(setLoading(true));
      const payload = {
        ...formData,
        seoKeywords: formData.seoKeywords.split(",").map((kw) => kw.trim()),
      };

      const endpoint = editing ? `${updateBrand}${editId}` : createBrand;
      const method = editing ? "PUT" : "POST";

      const res = await apiConnector(method, endpoint, payload);
      if (res.data.success) {
        toast.success(`Brand ${editing ? "updated" : "created"}!`);
        handleModalClose();
        fetchBrands();
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message || "Save failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className=" lg:w-[calc(100vw-256px)] h-[100vh] overflow-y-auto p-6 ">
      <div className="flex justify-between mb-6 items-center">
        <h1 className="text-2xl font-semibold">Manage Brands</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#FFD770] px-4 py-2 rounded text-black hover:brightness-110 transition"
        >
          + Add Brand
        </button>
      </div>
      <input
        type="text"
        placeholder="Search brands..."
        className="mb-4 w-full p-2 border rounded"
        onChange={(e) => {
          const term = e.target.value.toLowerCase();
          const filtered = brands.filter((b) =>
            `${b.name} ${b.slug} ${b.status} ${b.description}`
              .toLowerCase()
              .includes(term)
          );
          setBrands(filtered);
        }}
      />
      {loading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <div className="spinner" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full bg-white">
            <thead className="bg-[#FFD770]">
              <tr>
                <th className="p-2 pl-6 text-left">Name</th>
                <th className="p-2 pl-6 text-left">Slug</th>
                <th className="p-2 pl-6 text-left">Website</th>
                <th className="p-2 pl-6 text-left">Featured</th>
                <th className="p-2 pl-6 text-left">Status</th>
                <th className="p-2 pl-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((b) => (
                <tr key={b._id} className="border-t">
                  <td className="p-2 pl-6">{b.name}</td>
                  <td className="p-2 pl-6">{b.slug}</td>
                  <td className="p-2 pl-6 text-blue-600">{b.website}</td>
                  <td className="p-2 pl-6">{b.isFeatured ? "Yes" : "No"}</td>
                  <td className="p-2 pl-6 capitalize">{b.status}</td>
                  <td className="p-2 pl-6">
                    <button
                      onClick={() => handleEditOpen(b)}
                      className="px-3 py-1 bg-[#FFD770] rounded hover:brightness-110 text-black mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(b._id)}
                      className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {brands.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">
                    No brands found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal */}
      {showModal && (
        <div className="hidescroll fixed inset-0 z-[151]  bg-opacity-30 backdrop-blur-lg flex items-center justify-center">
          <div className="hidescroll bg-white text-black p-6 rounded-lg max-w-xl w-[90%] max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">
              {editing ? "Edit Brand" : "Add Brand"}
            </h2>
            {[
              "name",
              "slug",
              "description",
              "website",
              "metaTitle",
              "metaDescription",
            ].map((key) => (
              <input
                key={key}
                type="text"
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={formData[key]}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
                className="mb-3 w-full p-2 border rounded"
              />
            ))}
            {/* Logo fields */}
            <input
              type="text"
              placeholder="Logo URL"
              value={formData.logo.url}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  logo: { ...formData.logo, url: e.target.value },
                })
              }
              className="mb-2 w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Logo Alt Text"
              value={formData.logo.altText}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  logo: { ...formData.logo, altText: e.target.value },
                })
              }
              className="mb-3 w-full p-2 border rounded"
            />
            {/* SEO Keywords */}
            <textarea
              placeholder="SEO Keywords (comma separated)"
              value={formData.seoKeywords}
              onChange={(e) =>
                setFormData({ ...formData, seoKeywords: e.target.value })
              }
              className="mb-3 w-full p-2 border rounded"
            />
            {/* Featured and status */}
            <div className="mb-4 flex gap-4 items-center">
              <label>
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) =>
                    setFormData({ ...formData, isFeatured: e.target.checked })
                  }
                />{" "}
                Featured
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.status })}
                className="p-2 border rounded"
              >
                {" "}
                <option value="active">Active</option>{" "}
                <option value="inactive">Inactive</option>{" "}
              </select>{" "}
            </div>
            {/* Modal Actions */}{" "}
            <div className="flex justify-end gap-4 mt-4">
              {" "}
              <button
                onClick={handleModalClose}
                className="px-4 py-2 border rounded"
              >
                {" "}
                Cancel{" "}
              </button>{" "}
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#FFD770] text-black font-semibold rounded hover:brightness-110 transition min-w-[100px] flex justify-center items-center"
              >
                {" "}
                {loading ? <div className="loader1"></div> : <>Save</>}{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
};
export default Brands;
