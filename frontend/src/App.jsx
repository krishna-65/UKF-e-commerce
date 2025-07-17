import React from 'react'
import Navbar from './components/core/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/core/Footer'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ScrollToTop from './pages/Scrolltotop'


const App = () => {

 

  return (
    <div >

    <Navbar/>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Signup/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>

      <Footer/>
    </div>
  )
}

export default App
