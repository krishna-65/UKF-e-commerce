const BASE_URL = "http://localhost:4000"

// AUTH ENDPOINTS
export const endpoints = {
  SIGN_UP: BASE_URL + "/api/user/register",
  LOGIN_API: BASE_URL + "/api/user/login",
  FORGET_PASSWORD : BASE_URL + "/api/auth/forgot-password",
  RESET_PASSWORD : BASE_URL + "/api/auth/reset-password/"
  
}

//category endpoints

export const categoryEndpoints = {
  createCategory : BASE_URL + "/api/category/",
  getAllCategory : BASE_URL + "/api/category/",
  getCategory : BASE_URL + "/api/category/",
  updateCategory : BASE_URL + "/api/category/",
}
