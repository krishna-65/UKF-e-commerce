import React from 'react'
import Navbar from './components/core/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/core/Footer'

const App = () => {
  return (
    <div>

    <Navbar/>

      <Routes>
        <Route path="/" element={<Home/>}/>
      </Routes>

      <Footer/>
    </div>
  )
}

export default App
