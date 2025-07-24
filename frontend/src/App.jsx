import React from 'react'
import Navbar from './components/core/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/core/Footer'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ScrollToTop from './pages/Scrolltotop'
import AdminLayout from './pages/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import AddProduct from './pages/AddProduct'

import AddCategory from './pages/AddCategory'
import ViewUsers from './pages/ViewUsers'
import AboutUs from './pages/AboutUs'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Brands from './pages/Addbrand'
import CreateOrder from './pages/CreateOrder'


const App = () => {

 

  return (
    <div className='relative' >

    <Navbar  />

      <ScrollToTop />

      <div className='mt-[10vh] lg:mt-[17vh]'>
        <Routes >
        <Route path="/" element={<Signup/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/about" element={<AboutUs/>}/>

         <Route path="/admindashboard" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="addproduct" element={<AddProduct />} />
     
        <Route path="addcategory" element={<AddCategory/>} />
        <Route path='addbrands' element={<Brands/>}/>
        <Route path="viewusers" element={<ViewUsers />} />
      </Route>

      <Route path="create-order" element={<CreateOrder/>}/>
      <Route path="/products" element={<Products/>}/>
      <Route path="/productdetail" element={<ProductDetail/>}/>
      </Routes>
      </div>
      
      <Footer/>
    </div>
  )
}

export default App
