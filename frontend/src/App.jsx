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
import ManageProduct from './pages/ManageProduct'
import AddCategory from './pages/AddCategory'
import ViewUsers from './pages/ViewUsers'


const App = () => {

 

  return (
    <div >

    <Navbar/>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Signup/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>

         <Route path="/admindashboard" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="addproduct" element={<AddProduct />} />
        <Route path="manageproduct" element={<ManageProduct />} />
        <Route path="addcategory" element={<AddCategory/>} />
        <Route path="viewusers" element={<ViewUsers />} />
      </Route>
      </Routes>
      
      <Footer/>
    </div>
  )
}

export default App
