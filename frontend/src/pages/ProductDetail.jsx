import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ProductDetail() {
  const product = useSelector((state) => state.product.productData);
  const images = product?.images || [];

  const navigate = useNavigate();

  const buyNowHandler = () => {
    if (userRole !== "user") {
      toast.error("Please log in as a valid user!");
      return;
    }

    // dispatch({ type: "SET_ORDER_PRODUCT", payload: product }); // optional
    navigate("/create-order");
  };

  const userRole = useSelector((state) => state.auth.role);
  const dispatch = useDispatch();

  const [selectedImage, setSelectedImage] = useState(images[0]?.url || "");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const cartHandler = async () => {
    if (userRole !== "user") {
      toast.error("Please log in as a valid user!");
      return;
    }

    if (!product || !product._id || product.stock <= 0) {
      toast.error("Product is out of stock or invalid");
      return;
    }

    try {
      setIsAddingToCart(true);
      dispatch(addToCart(product));
      toast.success("Added to cart!");
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  useEffect(() => {
    if (images.length > 0) setSelectedImage(images[0].url);
  }, [images]);

  return (
    <div className="bg-black text-[#ecba49] min-h-screen p-6 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="flex flex-col gap-4">
          <div className="w-full h-[60vh] rounded-xl overflow-hidden">
            <img
              src={selectedImage}
              alt="Main Product"
              className="w-full h-full object-cover rounded-xl transition duration-300"
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={`Thumbnail ${idx + 1}`}
                onClick={() => setSelectedImage(img.url)}
                className={`w-16 h-16 object-cover rounded cursor-pointer border ${
                  selectedImage === img.url
                    ? "border-[#ecba49]"
                    : "border-transparent"
                } transition-all hover:scale-105`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">
            {product?.name || "Product Name"}
          </h1>

          <div className="flex items-center gap-3 text-sm">
            <span className="font-semibold text-[#ecba49]">
              ★ {product?.ratings?.average?.toFixed(1) || "0.0"}
            </span>
            <span className="text-gray-400">
              ({product?.reviews?.length || 0} reviews)
            </span>
            <span className="bg-yellow-600 text-black px-2 py-1 rounded text-xs font-bold">
              UKF's Pick
            </span>
          </div>

          <p className="text-sm text-gray-400">{product?.sold || 0}+ sold</p>

          <div className="space-y-1">
            <div className="flex gap-2 items-baseline">
              <span className="text-red-500 text-lg font-bold">-25%</span>
              <span className="text-2xl font-bold">₹{product?.price}</span>
            </div>
            <div className="text-gray-400 line-through">
              M.R.P.: ₹
              {product?.comparePrice || Math.round(product?.price * 1.25)}
            </div>
            <div className="text-sm text-gray-400">Inclusive of all taxes</div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="coupon" className="accent-[#ecba49]" />
            <label htmlFor="coupon" className="text-sm">
              Apply 3% coupon
            </label>
          </div>

          <div className="bg-[#1a1a1a] p-4 rounded space-y-2 text-sm">
            <div>🪙 Cashback: Upto ₹17.00 as wallet credit</div>
            <div>🏦 Bank Offer: ₹2,000 off on credit card payments</div>
            <div>🤝 Combo Offer: Buy 2 get 5% off, Buy 3 get 7% off</div>
          </div>

          <div className="text-green-500 font-semibold">
            {product?.stock > 0 ? "In stock" : "Out of stock"}
          </div>

          <p className="text-sm text-gray-400">
            Ships from UKF • Sold by RK World Infocom Pvt Ltd
          </p>
          <p className="text-sm text-gray-400">Payment: Secure transaction</p>

          {/* Details */}
          <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
            <div>
              <strong>Brand:</strong> {product?.brand?.name || "N/A"}
            </div>
            <div>
              <strong>Category:</strong>{" "}
              {product?.category?.name || "Uncategorized"}
            </div>
            <div>
              <strong>Material:</strong> {product?.material || "—"}
            </div>
            <div>
              <strong>Gender:</strong> {product?.gender || "Unisex"}
            </div>
            <div>
              <strong>Color:</strong> {product?.color || "—"}
            </div>
            <div>
              <strong>Size:</strong> {product?.size || "—"}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 mt-6">
            <button
              onClick={cartHandler}
              disabled={product.stock <= 0 || isAddingToCart}
              className="bg-[#ecba49] text-black px-6 py-2 rounded font-bold hover:brightness-110 disabled:opacity-50"
            >
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </button>
            <button
              onClick={buyNowHandler}
              className="border border-[#ecba49] px-6 py-2 rounded font-semibold hover:bg-[#ecba49] hover:text-black transition-all"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
