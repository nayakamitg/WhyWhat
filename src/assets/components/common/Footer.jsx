import { CirclePlus, CircleUser, Home, Plus, User } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router";
import { FaCircleUser, FaRegCircleUser } from "react-icons/fa6";
import LoginContext from "../../services/LoginContext";

const Footer = () => {
  const {userData}=useContext(LoginContext)
  const [nav,setNav]=useState("home")
    useEffect(() => {
    if (location.pathname === "/") setNav("home");
    else if (location.pathname.includes("post")) setNav("post");
    else if (location.pathname.includes("profile")) setNav("profile");
    else setNav("");
  }, [location]);
  return (
    <>
      <div className="footer container-fluid position-fixed bottom-0 d-flex justify-content-between align-items-center px-4">
        <NavLink to="/" className="d-flex flex-column align-items-center text-dark text-decoration-none" onClick={()=>setNav("home")}>
         {nav=="home"?<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-house-door-fill" viewBox="0 0 16 16">
  <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
</svg>:<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-house-door" viewBox="0 0 16 16">
  <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z"/>
</svg>}
          <span style={{ fontSize: "14px" }}>Home</span>
        </NavLink>
        <NavLink to="/post" className="d-flex flex-column align-items-center text-dark text-decoration-none" onClick={()=>setNav("post")}>
          <CirclePlus className="text-dark" />
          <span style={{ fontSize: "14px" }}>Ask Question</span>
        </NavLink>
        <NavLink to="/profile" className="d-flex flex-column align-items-center text-dark text-decoration-none" onClick={()=>setNav("profile")}>
          {nav=="profile"?<FaCircleUser size={25} />:<FaRegCircleUser size={25}/>}
          <span style={{ fontSize: "14px" }}>Profile</span>
        </NavLink>
      </div>
    </>
  );
};

export default Footer;
