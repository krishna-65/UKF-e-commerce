import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ProductDetail() {
  const product = useSelector((state) => state.product.productData);
  const images = product?.images || [];

  const navigate = useNavigate();
  const userRole = useSelector((state) => state.auth.role);
  const dispatch = useDispatch();

  const [selectedImage, setSelectedImage] = useState(images[0]?.url || "");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [animateButtons, setAnimateButtons] = useState(false);

  const buyNowHandler = () => {
    if (userRole !== "user") {
      toast.error("Please log in as a valid user!");
      return;
    }
    navigate("/create-order");
  };

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

  const handleImageSelect = (imageUrl) => {
    setImageLoading(true);
    setSelectedImage(imageUrl);
    // Simulate image loading
    setTimeout(() => setImageLoading(false), 200);
  };

  useEffect(() => {
    if (images.length > 0) {
      setSelectedImage(images[0].url);
      setImageLoading(false);
    }
    
    // Trigger animations
    setTimeout(() => setIsVisible(true), 100);
    setTimeout(() => setAnimateButtons(true), 800);
  }, [images]);

  const detailItems = [
    { label: "Brand", value: product?.brand?.name || "N/A" },
    { label: "Category", value: product?.category?.name || "Uncategorized" },
    { label: "Material", value: product?.material || "—" },
    { label: "Gender", value: product?.gender || "Unisex" },
    { label: "Color", value: product?.color || "—" },
    { label: "Size", value: product?.size || "—" }
  ];

  const offers = [
    { icon: "🪙", text: "Cashback: Upto ₹17.00 as wallet credit" },
    { icon: "🏦", text: "Bank Offer: ₹2,000 off on credit card payments" },
    { icon: "🤝", text: "Combo Offer: Buy 2 get 5% off, Buy 3 get 7% off" }
  ];

  return (
    <div className="bg-black text-[#ecba49] min-h-screen p-6 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Images Section */}
        <div className={`flex flex-col gap-4 transition-all duration-800 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'}`}>
          {/* Main Image */}
          <div className="w-full h-[60vh] rounded-xl overflow-hidden relative group">
            <div className={`absolute inset-0 bg-gray-800 rounded-xl transition-opacity duration-300 ${imageLoading ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center justify-center h-full">
                <div className="w-8 h-8 border-4 border-[#ecba49] border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
            <img
              src={selectedImage}
              alt="Main Product"
              className={`w-full h-full object-cover rounded-xl transition-all duration-500 group-hover:scale-110 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setImageLoading(false)}
            />
            {/* Image Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Zoom Indicator */}
            <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Click to zoom
            </div>
          </div>
          
          {/* Thumbnails */}
          <div className="flex gap-3 flex-wrap">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={`Thumbnail ${idx + 1}`}
                onClick={() => handleImageSelect(img.url)}
                className={`w-16 h-16 object-cover rounded cursor-pointer border-2 transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                  selectedImage === img.url
                    ? "border-[#ecba49] scale-110 shadow-lg"
                    : "border-transparent hover:border-[#ecba49]/50"
                } transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                style={{ transitionDelay: `${400 + idx * 100}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className={`space-y-4 transition-all duration-800 delay-200 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
          
          {/* Product Title */}
          <h1 className="text-3xl font-bold hover:text-yellow-300 transition-colors duration-300 cursor-default">
            {product?.name || "Product Name"}
          </h1>

          {/* Rating and Badge */}
          <div className={`flex items-center gap-3 text-sm transition-all duration-600 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <span className="font-semibold text-[#ecba49] hover:scale-110 transition-transform duration-300">
              ★ {product?.ratings?.average?.toFixed(1) || "0.0"}
            </span>
            <span className="text-gray-400 hover:text-gray-300 transition-colors duration-300">
              ({product?.reviews?.length || 0} reviews)
            </span>
            <span className="bg-yellow-600 text-black px-2 py-1 rounded text-xs font-bold animate-pulse hover:animate-none hover:scale-105 transition-transform duration-300">
              UKF's Pick
            </span>
          </div>

          {/* Sold Count */}
          <p className={`text-sm text-gray-400 transition-all duration-600 delay-400 hover:text-gray-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            {product?.sold || 0}+ sold
          </p>

          {/* Price Section */}
          <div className={`space-y-1 transition-all duration-600 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <div className="flex gap-2 items-baseline">
              <span className="text-red-500 text-lg font-bold animate-pulse">-25%</span>
              <span className="text-2xl font-bold hover:text-yellow-300 transition-colors duration-300">
                ₹{product?.price}
              </span>
            </div>
            <div className="text-gray-400 line-through hover:text-gray-300 transition-colors duration-300">
              M.R.P.: ₹{product?.comparePrice || Math.round(product?.price * 1.25)}
            </div>
            <div className="text-sm text-gray-400">Inclusive of all taxes</div>
          </div>

          {/* Coupon Checkbox */}
          <div className={`flex items-center gap-2 transition-all duration-600 delay-600 hover:scale-105 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <input type="checkbox" id="coupon" className="accent-[#ecba49] transition-transform duration-300 hover:scale-110" />
            <label htmlFor="coupon" className="text-sm cursor-pointer hover:text-yellow-300 transition-colors duration-300">
              Apply 3% coupon
            </label>
          </div>

          {/* Offers Section */}
          <div className={`bg-[#1a1a1a] p-4 rounded-lg space-y-2 text-sm border border-transparent hover:border-[#ecba49]/30 transition-all duration-600 delay-700 hover:shadow-lg ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            {offers.map((offer, idx) => (
              <div 
                key={idx}
                className="flex items-center gap-2 hover:text-yellow-300 transition-colors duration-300 hover:scale-105 transform"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <span className="text-lg">{offer.icon}</span>
                <span>{offer.text}</span>
              </div>
            ))}
          </div>

          {/* Stock Status */}
          <div className={`font-semibold transition-all duration-600 delay-800 hover:scale-105 ${
            product?.stock > 0 ? "text-green-500" : "text-red-500"
          } ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            {product?.stock > 0 ? "✓ In stock" : "✗ Out of stock"}
          </div>

          {/* Shipping Info */}
          <div className={`space-y-1 text-sm text-gray-400 transition-all duration-600 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <p className="hover:text-gray-300 transition-colors duration-300">
              Ships from UKF • Sold by RK World Infocom Pvt Ltd
            </p>
            <p className="hover:text-gray-300 transition-colors duration-300">
              Payment: Secure transaction 🔒
            </p>
          </div>

          {/* Product Details Grid */}
          <div className={`grid grid-cols-2 gap-3 mt-4 text-sm transition-all duration-600 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            {detailItems.map((item, idx) => (
              <div 
                key={idx}
                className="hover:text-yellow-300 transition-all duration-300 hover:scale-105 transform p-2 rounded hover:bg-[#1a1a1a]"
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                <strong>{item.label}:</strong> {item.value}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-wrap gap-4 mt-6 transition-all duration-800 ${animateButtons ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <button
              onClick={cartHandler}
              disabled={product?.stock <= 0 || isAddingToCart}
              className={`relative bg-[#ecba49] text-black px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:brightness-110 hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden ${
                isAddingToCart ? 'animate-pulse' : ''
              }`}
            >
              {/* Button Ripple Effect */}
              <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity duration-300 rounded-lg"></div>
              <span className="relative z-10">
                {isAddingToCart ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </div>
                ) : (
                  "Add to Cart"
                )}
              </span>
            </button>
            
            <button
              onClick={buyNowHandler}
              className="relative border-2 border-[#ecba49] px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-[#ecba49] hover:text-black hover:scale-105 hover:shadow-lg active:scale-95 overflow-hidden group"
            >
              {/* Button Background Animation */}
              <div className="absolute inset-0 bg-[#ecba49] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              <span className="relative z-10">Buy Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .shimmer {
          position: relative;
          overflow: hidden;
        }

        .shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(236, 186, 73, 0.2), transparent);
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}