import React, { useEffect, useState } from "react";
import { setLoading } from "../../slices/authSlice";
import { apiConnector } from "../../services/apiConnector";
import toast from "react-hot-toast";
import { categoryEndpoints } from "../../services/api";
import { useSelector, useDispatch } from "react-redux";
import { updateFilter } from "../../slices/filterSlice";

const { getAllCategory } = categoryEndpoints;

const priceRanges = [
  { label: "Under ₹499", min: 0, max: 499 },
  { label: "₹500 - ₹599", min: 500, max: 599 },
  { label: "₹600 - ₹699", min: 600, max: 699 },
  { label: "₹700 - ₹799", min: 700, max: 799 },
  { label: "₹800 - ₹899", min: 800, max: 899 },
  { label: "₹900 - ₹999", min: 900, max: 999 },
  { label: "₹1000 - ₹1999", min: 1000, max: 1999 },
  { label: "₹2000 - ₹2999", min: 2000, max: 2999 },
  { label: "₹3000 - ₹3999", min: 3000, max: 3999 },
  { label: "₹4000 - ₹4999", min: 4000, max: 4999 },
  { label: "₹5000 & Above", min: 5000, max: Infinity },
];

const ProductSidebar = () => {
  const filters = useSelector((state) => state.filters);
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();

  const getAllCategories = async () => {
    try {
      dispatch(setLoading(true));
      const res = await apiConnector("GET", getAllCategory);
      setCategories(res.data);
      toast.success("All Categories fetched successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Unable to fetch categories");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleCheckboxChange = (type, value, checked) => {
    if (type === "priceRange") {
      const isAlreadyChecked = filters.priceRanges.some(
        (range) => range.min === value.min && range.max === value.max
      );

      dispatch(
        updateFilter({
          type,
          value: {
            min: value.min,
            max: value.max,
            label: value.label,
          },
          checked: !isAlreadyChecked, // Toggle the checked state
        })
      );
      return;
    }

    // Handle other filters
    dispatch(updateFilter({ type, value, checked }));
  };

  return (
    <>
      {/* Hamburger for small screens */}
      <button
        className="lg:hidden fixed top-4 left-4 z-150 cursor-pointer text-[#FFD700] bg-black p-2 rounded focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 lg:static h-screen w-64 bg-black text-[#FFD700] transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } product-sidebar transition-transform duration-300 ease-in-out lg:translate-x-0 z-40 overflow-y-auto shadow-lg`}
      >
        {/* Close button on mobile */}
        <div className="lg:hidden flex justify-end p-4">
          <button
            onClick={() => setIsOpen(false)}
            className="text-[#FFD700] hover:text-white cursor-pointer text-3xl font-bold bg-transparent rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#FFD700] hover:bg-opacity-20 transition-all"
          >
            close me
          </button>
        </div>

        {/* Navigation & Filters */}
        <div className="p-4 space-y-6">
          {/* Categories */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Categories</h2>
            {categories.length > 0 ? (
              categories.filter((cat) => cat.status === "active").map((cat) => (
                <label key={cat._id} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    value={cat.name}
                    checked={filters.categories.includes(cat.name)}
                    onChange={(e) =>
                      handleCheckboxChange("categories", cat.name, e.target.checked)
                    }
                    className="mr-2"
                  />
                  {cat.name}
                </label>
              ))
            ) : (
              <p>No categories found</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Gender</h2>
            {["Men", "Women", "Unisex"].map((gender) => (
              <label key={gender} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  value={gender}
                  checked={filters.gender.includes(gender)}
                  onChange={(e) =>
                    handleCheckboxChange("gender", gender, e.target.checked)
                  }
                  className="mr-2"
                />
                {gender}
              </label>
            ))}
          </div>

          {/* Material */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Material</h2>
            {["Cotton", "Nylon", "Wool", "Polyester", "Terrycotta", "Leather"].map(
              (material) => (
                <label key={material} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    value={material}
                    checked={filters.material.includes(material)}
                    onChange={(e) =>
                      handleCheckboxChange("material", material, e.target.checked)
                    }
                    className="mr-2"
                  />
                  {material}
                </label>
              )
            )}
          </div>

          {/* Color */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Color</h2>
            {[
              "Red",
              "Blue",
              "Green",
              "Black",
              "White",
              "Yellow",
              "Pink",
              "Brown",
              "Orange",
            ].map((color) => (
              <label key={color} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  value={color}
                  checked={filters.color.includes(color)}
                  onChange={(e) =>
                    handleCheckboxChange("color", color, e.target.checked)
                  }
                  className="mr-2"
                />
                <span
                  className="w-4 h-4 inline-block rounded-full mr-2"
                  style={{ backgroundColor: color.toLowerCase() }}
                ></span>
                {color}
              </label>
            ))}
          </div>

          {/* Size */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Size</h2>
            {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
              <label key={size} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  value={size}
                  checked={filters.size.includes(size)}
                  onChange={(e) =>
                    handleCheckboxChange("size", size, e.target.checked)
                  }
                  className="mr-2"
                />
                {size}
              </label>
            ))}
          </div>

          {/* Price Range */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Price Range</h2>
            {priceRanges.map((range) => (
              <label key={range.label} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  value={range.label}
                  checked={filters.priceRanges.some(
                    (pr) => pr.min === range.min && pr.max === range.max
                  )}
                  onChange={() =>
                    handleCheckboxChange(
                      "priceRange",
                      {
                        min: range.min,
                        max: range.max,
                        label: range.label,
                      },
                      !filters.priceRanges.some(
                        (pr) => pr.min === range.min && pr.max === range.max
                      )
                    )
                  }
                  className="mr-2"
                />
                {range.label}
              </label>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductSidebar;
