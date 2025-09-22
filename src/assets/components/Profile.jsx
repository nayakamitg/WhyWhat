// import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

function decodeJWT(token) {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

const validate = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData) return false;

  const currentTime = Math.floor(Date.now() / 1000);

  if (userData.exp > currentTime) {
    console.log("Token valid");
    return true;
  } else {
    console.log("Token expired");
    localStorage.removeItem("userData");
    return false;
  }
};



import React, { useContext, useEffect, useState } from 'react';
import {  Heart, MessageCircle, Grid, User, Eye, Ellipsis, EllipsisVertical } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostsSuccess } from '../services/slices/postSlice';
import { useNavigate } from 'react-router';
import LoginContext from "../services/LoginContext";

const Profile = () => {
  const {posts}=useSelector((state)=>state.post)
  const [activeTab, setActiveTab] = useState('questions');
  const dispatch=useDispatch()
const navigate=useNavigate()

  const {userData,setUserData,loggedIn,setLoggedIn}=useContext(LoginContext)

  useEffect(() => {
    if (validate()) {
      setUserData(JSON.parse(localStorage.getItem("userData")));
      setLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;
    const userObject = decodeJWT(token);
    localStorage.setItem("userData", JSON.stringify(userObject));
    setUserData(userObject);
    setLoggedIn(true);
  };

    const handleLoginError = () => {
    console.log("Login Failed");
    setLoggedIn(false);
  };

  useEffect(()=>{
    dispatch(fetchPostsSuccess())
  },[])




  const stats = [
    { label: 'Questions', count: '50', key: 'questions' },
    { label: 'Followers', count: '5k', key: 'followers' },
    { label: 'Following', count: '1k', key: 'following' }
  ];

  const tabs = [
    { key: 'questions', label: 'Questions', icon: Grid },
    { key: 'answers', label: 'Answers', icon: MessageCircle },
    { key: 'favorite', label: 'Favorite', icon: Heart }
  ];



 
  if(!loggedIn){
    return(
      <div className="w-75 m-auto pt-5">
       <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginError} />
      
      </div>
    )
  }

  return (
    <>  
      <style>
        {`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          
          .profile-container {
            max-width: 100%;
            margin: 0 auto;
            background: #fff;
            min-height: 100vh;
            border-left: 1px solid #e0e0e0;
            border-right: 1px solid #e0e0e0;
          }

          .profile-header {
            background: #fff;
            border-bottom: 1px solid #e0e0e0;
            position: sticky;
            top: 0;
            z-index: 100;
          }

          .profile-info {
            background: linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 100%);
            padding: 24px;
          }

          .avatar-container {
            position: relative;
            margin-right: 16px;
          }

          .avatar-ring {
            width: 88px;
            height: 88px;
            background: linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d);
            border-radius: 50%;
            padding: 3px;
          }

          .avatar-inner {
            width: 100%;
            height: 100%;
            background: #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .avatar-img {
            width: 72px;
            height: 72px;
            background: #f0f0f0;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .status-indicator {
            position: absolute;
            bottom: 2px;
            right: 2px;
            width: 20px;
            height: 20px;
            background: #4CAF50;
            border: 3px solid #fff;
            border-radius: 50%;
          }

          .stats-container {
            background: rgba(255, 255, 255, 0.9);
            border-radius: 16px;
            padding: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            margin-top: 20px;
          }

          .stat-item {
            text-align: center;
            cursor: pointer;
            transition: transform 0.2s ease;
          }

          .stat-item:hover {
            transform: scale(1.05);
          }

          .stat-number {
            font-size: 22px;
            font-weight: 700;
            color: #262626;
            margin: 0;
          }

          .stat-label {
            font-size: 13px;
            color: #8e8e8e;
            font-weight: 500;
            margin: 0;
          }

          .tabs-container {
            background: #fff;
            border-bottom: 1px solid #e0e0e0;
            position: sticky;
            top: 56px;
            z-index: 99;
          }

          .tab-btn {
            flex: 1;
            background: none;
            border: none;
            padding: 16px 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            color: #8e8e8e;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
            border-bottom: 2px solid transparent;
          }

          .tab-btn.active {
            color: #262626;
            border-bottom-color: #262626;
          }

          .tab-btn:hover:not(.active) {
            color: #262626;
            background: #fafafa;
          }
.content-grid{
padding:10px;
display:flex;
flex-wrap:wrap;
gap:10px;
}
       
.story-card{
max-width:300px;
flex:1 1 150px
}

         

        `}
      </style>

      <div className="profile-container">
        {/* Header */}
        {/* <div className="profile-header">
          <div className="d-flex align-items-center justify-content-between p-3">
            <div className="d-flex align-items-center">
              <ArrowLeft size={30} className='mx-3' onClick={()=>navigate(-1)}/>
              <h5 className="mb-0 fw-semibold">My Profile</h5>
            </div>
           
          </div>
        </div> */}

        {/* Profile Info */}
        <div className="profile-info">

          <div className="d-flex flex-column">
          <div className="d-flex align-items-center">

            <div className="avatar-container">
              <div className="avatar-ring">
                <div className="avatar-inner">
                  <div className="avatar-img">
                    <img className="" style={{borderRadius:"50%"}} src={userData.picture} alt="" />
                    <User size={36} color="#999" />
                  </div>
                </div>
              </div>
              <div className="status-indicator"></div>
           
            </div>
            
            <div className="flex-grow-1">
              <h2 className="username">{userData.name}</h2>
              <p className="bio">@tag</p>
            </div>
         <EllipsisVertical/>
            </div>
          </div>
      

          {/* Stats */}
          <div className="stats-container">
            <div className="row">
              {stats.map((stat) => (
                <div key={stat.key} className="col-4">
                  <div className="stat-item">
                    <p className="stat-number">{stat.count}</p>
                    <p className="stat-label">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <div className="d-flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Grid */}
        <div className="content-grid">
            {posts[0]?.stories?.map((story,item) => (
              <SingleCard post={posts[0]} story={story} />                 
          
            ))}
        
        </div>
      </div>
    </>
  );
};

export default Profile;


const SingleCard = ({ post, story }) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        key={story.id}
        className={`story-card ${
          story.gradient
        } text-decoration-none`}
        onClick={() => navigate(`/detail/${[post.id, story.id].join(",")}`)}
      >
        <div className="d-flex flex-column h-100 story-card-main">
          {/* Story Header */}

          <p className="text-center Answer">{story.answer}</p>

          {/* Story Footer - Only Views */}
          <div className="story-footer">
            <div className="story-views">
              <Eye size={16} className="me-2" />
              {story.views}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};