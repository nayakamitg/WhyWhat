import React, { useContext, useEffect, useState } from "react";
import {
  Heart,
  MessageCircle,
  Grid,
  User,
  Eye,
  Ellipsis,
  EllipsisVertical,
  MoreVertical,
  LogOut,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../services/slices/postSlice";
import { createUser, login, setUserFromStorage, logout } from "../services/slices/userSlice";
import { useNavigate, useParams } from "react-router";
import { Dropdown, Spinner } from "react-bootstrap";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import axios from "axios";



const UserProfile = () => {
  const [following,setFollowing]=useState(false)
  const {handle}=useParams()
  console.log("Handle",handle)
  const { posts, loading: postsLoading, error: postsError } = useSelector((state) => state.post);
  const {
    userData,
    loggedIn,
    loading: authLoading,
    error: authError,
  } = useSelector((state) => state.user);
  const [userProfileData,setUserProfileData]=useState(null)
  const [activeTab, setActiveTab] = useState("questions");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mode = localStorage.getItem("mode") || "light";

  useEffect(() => {
    if (!loggedIn) {
    
      const googleData = JSON.parse(localStorage.getItem("googleUserData"));
    if(googleData){
        dispatch(
          login({
            handle: `@${googleData?.email?.split("@")[0]}`,
            googleData:googleData,
          })
        );
      
    }
  }
  }, []);

const getUserProfile=async(handle)=>{
  try {
    const url= `${import.meta.env.VITE_API_BASE_URL}/Users/${encodeURIComponent(handle)}`
    console.log("url",url)
    const res = await axios.get(
      url
    );
    setUserProfileData(res.data)
    
  } catch (error) {
    const msg = error.response?.data?.message || error.message;
    console.log(error)
    toast.error(msg);
  }
}

const follow=async()=>{
  try{
    const res=await axios.post(`${import.meta.env.VITE_API_BASE_URL}/Social/follow`,
      {
        "followTo": userProfileData.user.userId
      },
    {
      headers:{
        "X-User-Id":userData.user.userId
      }
    }
    )
    setFollowing(true)
  }
  catch (e){
    console.log("Error to follow",e)
    toast.error(e.message || "Failed to follow")
  }

}

const handleFollow=()=>{
  if(!loggedIn){
    navigate("/login")
  }
  else{
    console.log("Followed")
    follow()
  }
}

  useEffect(()=>{
getUserProfile(handle)
  },[])

console.log("UserData",userProfileData)
  // Load posts when user is logged in
  useEffect(() => {
    if (loggedIn && posts.length <= 0) {
      dispatch(fetchPosts());
    }
  }, [dispatch, loggedIn, posts.length]);

  // Handle posts error
  useEffect(() => {
    if (postsError) {
      toast.error(postsError);
    }
  }, [postsError]);

  useEffect(()=>{
    if(loggedIn){
    userData?.following?.forEach((Sfollowing)=>{
      if(Sfollowing?.handle==handle){
        setFollowing(true);
        return
      }
    })
  }
  },[])

  // Stats configuration
  const stats = [
    { label: "Questions", count: userProfileData?.questions?.length || "0", key: "questions" },
    { label: "Followers", count: userProfileData?.followers?.length || "0", key: "followers" },
    { label: "Following", count: userProfileData?.following?.length || "0", key: "following" },
  ];

  const tabs = [
    { key: "questions", label: "Questions", icon: Grid },
    { key: "answers", label: "Answers", icon: MessageCircle },
    { key: "favorite", label: "Favorite", icon: Heart },
  ];

  return (
    <>
      <style>
        {`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          
          .profile-container {
            width: 100%;
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
            width: 80px;
            height: 80px;
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
            width: 77px;
            height: 77px;
            background: #f0f0f0;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }

          .avatar-img img {
            width: 100%;
            height: 100%;
            object-fit: cover;
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
            z-index: 9;
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

          .content-grid {
            padding: 10px;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }
       
          .story-card {
            max-width: 300px;
            flex: 1 1 150px;
            cursor: pointer;
            transition: transform 0.2s ease;
          }

          .story-card:hover {
            transform: translateY(-2px);
          }

          .username {
            font-size: 24px;
            font-weight: 600;
            margin: 0;
            color: #262626;
          }

          .bio {
            color: #8e8e8e;
            font-size: 14px;
            margin: 4px 0 0 0;
          }
        `}
      </style>

      <div className="profile-container">
        {/* Profile Info */}
        <div className="profile-info">
          <div className="d-flex flex-column">
            <div className="d-flex align-items-center">
              <div className="avatar-container">
                <div className="avatar-ring">
                  <div className="avatar-inner">
                    <div className="avatar-img">
                    
                        <img
                          src={userProfileData?.user?.profileImage || "/profile.webp"}
                          alt={userProfileData?.user?.name}
                          onError={(e)=>e.target.src="/profile.webp"}
                        />
                     
                    </div>
                  </div>
                </div>
                <div className="status-indicator"></div>
              </div>

              <div className="flex-grow-1">
                <h2 className="username">{userProfileData?.user?.name || 'User'}</h2>
                <p className="bio">{userProfileData?.user?.handle || '@user'}</p>
                <p className="bio">{userProfileData?.user?.email || '@user'}</p>
              </div>

{handle==userData?.user?.handle || <button onClick={handleFollow} className="btn btn-outline-dark py-1">
  {following?"Following":"Follow"}
</button>
}

             
              
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
                  className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
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
          { activeTab === "questions" ? (
            userProfileData?.questions?.length === 0 ? (
              <h1 className="w-100 py-5 text-center">No data found</h1>
            ) : (
              userProfileData?.questions?.map((ques, index) => (
                <SingleCard key={index} ques={ques} />
              ))
            )
          ) : userProfileData?.answers?.length===0 ? (
            <h1 className="w-100 py-5 text-center">No data found</h1>
          ) : (
            userProfileData?.answers?.map((ans, index) => (
              <SingleCard key={index} ques={ans} />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;

const SingleCard = ({ ques }) => {
  const navigate = useNavigate();
  
  return (
    <div
      className={`story-card ${ques?.gradient || 'gradient-2'} text-decoration-none`}
      onClick={() => navigate(`/detail/${[ques.questionId, ques.answerId].join(",")}`)}
    >
      <div className="d-flex flex-column h-100 story-card-main">
        <p className="text-center Answer">{ques?.answerText ||ques.questionText}</p>
        <div className="story-footer">
          <div className="story-views">
            <Eye size={16} className="me-2" />
            {ques?.totalViews || 0}
          </div>
        </div>
      </div>
    </div>
  );
};