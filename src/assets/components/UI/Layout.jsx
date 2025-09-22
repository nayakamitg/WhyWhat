import React, { useContext, useState } from 'react'
import Header from '../common/Header'
import { Outlet } from 'react-router'
import "../../../App.css"
import Footer from '../common/Footer'
import ThemeContext from '../../services/ThemeContext'

const Layout = () => {
const {mode,setMode}=useContext(ThemeContext)
const [page,setPage]=useState("home")
  return (
    <>
    
    

    <Header mode={mode} setMode={setMode}/>
    <div className="container-fluid mainHomeContainer p-0">
    <Outlet/>

    </div>
    <Footer page={page} setPage={setPage}/>

    </>
  )
}

export default Layout
