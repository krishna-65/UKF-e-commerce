import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ProductDetail() {
  const product = useSelector((state) => state.product.productData);
  const images = product?.images || [];
  const [open, setOpen] = useState(images[0]);

  useEffect(() => {
    if (images.length > 0) setOpen(images[0]);
  }, [images]);

  return (
    <div className="bg-black text-[#ecba49] min-h-screen p-6 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Image Section */}
        <div className="flex flex-col gap-4">
          <div className="w-[90vw] h-[40vh] lg:w-[40vw] lg:h-[50vh]">
            {open && (
              <img
                src={open}
                alt="Main Product"
                className="w-full h-full object-cover rounded-xl"
              />
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {images.map((img, index) => (
              <img
                key={index}
                onClick={() => setOpen(img)}
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className={`w-14 h-14 cursor-pointer rounded border ${
                  open === img ? "border-[#ecba49]" : "border-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold leading-tight">
            {product?.name || "Unnamed Product"}
          </h1>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-[#ecba49] font-semibold">
              ★ {product?.ratings?.toFixed(1) || "0.0"}
            </span>
            <span className="text-gray-400">
              ({product?.reviews?.length || 0} reviews)
            </span>
            <span className="bg-yellow-600 text-black px-2 py-0.5 text-xs font-bold rounded">
              UKF's Pick
            </span>
          </div>

          <p className="text-sm text-gray-400">{product?.sold || 0}+ sold</p>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-red-500 font-semibold text-lg">-25%</span>
              <span className="text-2xl font-bold">₹{product?.price}</span>
            </div>
            <div className="text-sm text-gray-400 line-through">
              M.R.P.: ₹{Math.round(product?.price * 1.25)}
            </div>
            <div className="text-sm text-gray-400">Inclusive of all taxes</div>
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" />
            <label className="text-sm">Apply 3% coupon</label>
          </div>

          <div className="bg-[#1a1a1a] p-4 rounded-lg text-sm space-y-2">
            <div>🪙 Cashback: Upto ₹17.00 as wallet credit</div>
            <div>🏦 Bank Offer: Upto ₹2,000.00 off on Credit Cards</div>
            <div>🤝 Combo Offer: Buy 2 Get 5% Off, Buy 3 Get 7% Off</div>
          </div>

          <div className="text-sm space-y-1">
            <div>
              <strong>FREE delivery</strong> in 3–5 days
            </div>
            <div>Delivering to Kotdwara</div>
          </div>

          <div className="text-green-500 font-semibold">
            {product?.stock > 0 ? "In stock" : "Out of stock"}
          </div>

          <div className="text-sm text-gray-400">
            Ships from UKF • Sold by RK World Infocom Pvt Ltd
          </div>

          <div className="text-sm text-gray-400">
            Payment: Secure transaction
          </div>

          {/* Attributes */}
          <div className="text-sm mt-2 space-y-1">
            <div>
              <strong>Brand:</strong> {product?.brand || "N/A"}
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
          <div className="flex gap-4 mt-4">
            <button className="bg-[#ecba49] text-black px-6 py-2 cursor-pointer rounded font-semibold hover:opacity-90">
              Add to Cart
            </button>
            <button className="border border-[#ecba49] px-6 py-2 rounded duration-500 cursor-pointer font-semibold hover:bg-[#ecba49] hover:text-black">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
