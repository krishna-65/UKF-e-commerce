import React from 'react'
import Navbar from './components/core/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/core/Footer'
import Signup from './pages/Signup'

const App = () => {
  return (
    <div>

    <Navbar/>

      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/signup" element={<Signup/>}/>
      </Routes>

      <Footer/>
    </div>
  )
}

export default App
