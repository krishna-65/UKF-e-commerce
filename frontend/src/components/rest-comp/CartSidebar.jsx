import React, { useState } from 'react';
import { FaShoppingCart, FaTimes, FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, decreaseItemQuantity, removeFromCart } from '../../slices/cartSlice';

const CartSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  
  // Mock data for demonstration - replace with your actual cart state
  const cart = useSelector(state => state.cart.cart || []);
  const totalItems = useSelector(state => state.cart.totalItems || 0);
  const total = useSelector(state => state.cart.total || 0)
  


  
  const displayItems = cart ;

  const updateQuantity = (id, change) => {
    // Dispatch your quantity update action here
    console.log(`Update item ${id} quantity by ${change}`);
  };

  const removeItem = (id) => {
    // Dispatch your remove item action here
    console.log(`Remove item ${id}`);
  };

//   const addRecommended = () => {
//     // Dispatch add recommended item action here
//     console.log('Add recommended item');
//   };

  return (
    <>
      {/* Cart Icon */}
      <div className="relative cursor-pointer" onClick={() => setIsOpen(true)}>
        <FaShoppingCart className="text-[#FFD700] text-xl" />
        {(totalItems > 0 || cart.length > 0) && (
          <div className="absolute z-[200] w-5 h-5 bg-[#FFD700] rounded-full top-0 right-0 text-sm text-black -translate-y-1/2 translate-x-1/2 flex justify-center items-center font-bold">
            {totalItems || cart.length}
          </div>
        )}
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 backdrop-blur-2xl bg-opacity-50 z-[300]" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Cart Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-black text-[#FFD700] z-[400] transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } shadow-2xl border-l-2 border-[#FFD700]`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#FFD700] border-opacity-30">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-[#FFD700] hover:text-white text-xl p-1"
          >
            <FaTimes />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col h-full">
          <div className=" hidescroll flex-1 overflow-y-auto p-4">
            
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {displayItems.map((item) => (
                <div key={item.id} className="flex gap-3 p-4 bg-gray-900 bg-opacity-70 rounded-lg border border-[#FFD700] border-opacity-20">
                  <img 
                    src={item.images?.[0]?.url} 
                    alt={item.name}
                    className="w-20 h-24 object-cover rounded-md flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-[#FFD700] mb-1 leading-tight">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-300 mb-3">{item.color}</p>
                    
                    <div className="space-y-2">
                      <div className="flex flex-col">
                        <span className="text-[#FFD700] font-bold text-lg">₹{item.price}</span>
                        {item.originalPrice && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 line-through">
                              ₹{item.originalPrice}
                            </span>
                            <span className="text-xs text-red-400 font-semibold">
                              ({item.discount}% Off)
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => dispatch(decreaseItemQuantity(item))}
                            className="w-8 h-8 bg-[#FFD700] text-black rounded-full flex items-center justify-center text-sm font-bold hover:bg-yellow-500 transition-colors"
                          >
                            <FaMinus />
                          </button>
                          <span className="text-lg font-bold w-8 text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => dispatch(addToCart(item))}
                            className="w-8 h-8 bg-[#FFD700] text-black rounded-full flex items-center justify-center text-sm font-bold hover:bg-yellow-500 transition-colors"
                          >
                            <FaPlus />
                          </button>
                        </div>
                        
                        {/* Remove Button */}
                        <button 
                          onClick={() => dispatch(removeFromCart(item))}
                          className="text-red-400 hover:text-red-300 p-2 hover:bg-red-900 hover:bg-opacity-20 rounded transition-colors"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommended Item */}
            {/* <div className="mb-6">
              <h3 className="text-lg font-bold mb-3 text-[#FFD700]">Before You Go</h3>
              <div className="flex gap-3 p-4 bg-gray-900 bg-opacity-50 rounded-lg border border-[#FFD700] border-opacity-40">
                <img 
                  src={mockRecommended.image} 
                  alt={mockRecommended.name}
                  className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[#FFD700] mb-1 leading-tight">
                    {mockRecommended.name}
                  </h4>
                  <p className="text-xs text-gray-300 mb-2">
                    {mockRecommended.color}
                  </p>
                  <span className="text-[#FFD700] font-bold text-lg">
                    ${mockRecommended.price}
                  </span>
                </div>
                
                <button 
                  onClick={addRecommended}
                  className="bg-[#FFD700] text-black px-4 py-2 rounded-md text-sm font-bold hover:bg-yellow-500 h-fit transition-colors"
                >
                  ADD
                </button>
              </div>
            </div> */}
          </div>

          {/* Footer */}
          <div className="border-t-2 border-[#FFD700] border-opacity-50 p-4 mb-8 bg-gray-900 bg-opacity-80">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-bold">
                Subtotal ({cart.length} items)
              </span>
              <span className="text-2xl font-bold text-[#FFD700]">
                ₹{total}
              </span>
            </div > 
            
            <button className="w-full bg-[#FFD700] text-black py-4 rounded-lg font-bold text-base hover:bg-yellow-500 transition-colors  shadow-lg">
              CONTINUE TO CHECKOUT
            </button>
            
            <p className="text-center text-xs text-gray-400 mb-6 mt-2">
              ASAP, get it now before it sells out.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;