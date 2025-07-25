


const BASE_URL = "http://localhost:4000"

// AUTH ENDPOINTS
export const endpoints = {
  SIGN_UP: BASE_URL + "/api/user/register",
  LOGIN_API: BASE_URL + "/api/user/login",
  FORGET_PASSWORD : BASE_URL + "/api/auth/forgot-password",
  RESET_PASSWORD : BASE_URL + "/api/auth/reset-password/",
  updateProfile : BASE_URL + "/api/user/update/",
  getProfile: BASE_URL + "/api/user/profile/",
  updatePicture : BASE_URL + "/api/user/updatePicture/",
}

//category endpoints

export const categoryEndpoints = {
  createCategory : BASE_URL + "/api/category/",
  getAllCategory : BASE_URL + "/api/category/",
  getCategory : BASE_URL + "/api/category/",
  updateCategory : BASE_URL + "/api/category/",
  deleteCtegory : BASE_URL + "/api/category/",
  activeInactiveCategory : BASE_URL + "/api/category/status/"
}

//product endpoints

export const productEndpoints = {
  createProduct : BASE_URL + "/api/product/add",
  getAllProduct : BASE_URL + "/api/product/",
  getProduct : BASE_URL + "/api/product/",
  updateProduct : BASE_URL + "/api/product/update/",
  deleteProduct : BASE_URL + "/api/product/",
}

//cart endopints

export const cartEndpoints = {
  addToCart : BASE_URL + "/api/cart/",
  getCart : BASE_URL + "/api/cart/",
  removeFromCart : BASE_URL + "/api/cart/",
  updateCartItem : BASE_URL + "/api/cart/",
  clearCart : BASE_URL + "/api/cart/",
  bulkCart : BASE_URL + "/api/cart/"
}

// brands endpoints

export const brandEndpoints = {
  getAllBrands : BASE_URL + "/api/brand/",
  createBrand : BASE_URL + "/api/brand/",
  updateBrand : BASE_URL +  "/api/brand/",
  getFeaturedBrands : BASE_URL + "/api/brand/featured",
  getBrandsWithProducts : BASE_URL + "/api/brand/with-products",
  getBrandById : BASE_URL + "/api/brand/",
   deleteBrand : BASE_URL +  "/api/brand/",
}

//address endpoints

export const addressEndpoints = {
  createAddress : BASE_URL + "/api/address/",
  getUserAddress : BASE_URL + "/api/address/user/",
  updateAddress : BASE_URL + "/api/address/",
  deleteAddress : BASE_URL + "/api/address/",
  setDefaultAddress : BASE_URL + "/api/address/"
}

//orders endpoints

export const orderEndpoints = {
  createOrder : BASE_URL + "/api/order/",
  getUserOrders : BASE_URL + "/api/order/my-orders",
  getOrderById : BASE_URL + "/api/order/",
  cancelOrder : BASE_URL + "/api/order/",
  getAllOrders : BASE_URL + "/api/order/",
  updateOrderStatus : BASE_URL + "/api/order/",
  addTrackingInfo : BASE_URL + "/api/order/"
}

//payment endpoints

export const paymentEndpoints = {
  createPayment : BASE_URL + "/api/payment/create-order",
  verifyPayment : BASE_URL + "/api/payment/verify-payment"
}
