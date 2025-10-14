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
import {
  createUser,
  login,
  setUserFromStorage,
  logout,
} from "../services/slices/userSlice";
import { useNavigate } from "react-router";
import { Dropdown, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const {
    posts,
    loading: postsLoading,
    error: postsError,
  } = useSelector((state) => state.post);
  const {t}=useTranslation()
  const {
    userData,
    loggedIn,
    loading: authLoading,
    error: authError,
  } = useSelector((state) => state.user);

  const [activeTab, setActiveTab] = useState("questions");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const mode = localStorage.getItem("mode") || "light";


  // Load posts when user is logged in
  useEffect(() => {
    if (loggedIn && posts.length <= 0) {
      dispatch(fetchPosts());
    }
  }, [dispatch, loggedIn, posts.length]);

  // Handle posts error
  useEffect(() => {
    if (postsError) {
      console.error(postsError);
    }
  }, [postsError]);
  

  // Show login screen if user is not logged in
  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    }
  }, [loggedIn]);


     useEffect(() => {
          
              const googleData = JSON.parse(localStorage.getItem("googleUserData"));
              if (googleData) {
                dispatch(
                  login({
                    handle: `@${googleData?.email?.split("@")[0]}`,
                    googleData: googleData,
                  })
                );
             
            }
          }, [navigate]);
  

  // Stats configuration
  const stats = [
    {
      label: t("question"),
      count: userData?.statistics?.totalQuestions || "0",
      key: "questions",
    },
    {
      label: t("followers"),
      count: userData?.statistics?.totalFollowers || "0",
      key: "followers",
    },
    {
      label: t("following"),
      count: userData?.statistics?.totalFollowing || "0",
      key: "following",
    },
  ];

  const tabs = [
    { key: "questions", label: t("questions"), icon: Grid },
    { key: "answers", label: t("answers"), icon: MessageCircle },
    { key: "favorite", label: t("favorite"), icon: Heart },
  ];

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
            background: transparent;
            min-height: 100vh;
          }

          .profile-header {
            background: #fff;
            border-bottom: 1px solid #e0e0e0;
            position: sticky;
            top: 0;
            z-index: 100;
          }

          .profile-info {
            background: transparent;
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
            width: 80px;
            height: 80px;
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
            margin: 0;
          }

          .stat-label {
            font-size: 13px;
            font-weight: 500;
            margin: 0;
          }

          .tabs-container {
            background: #ffffffff;
            border-bottom: 1px solid #e0e0e0;
            position: sticky;
            top: 56px;
            z-index: 2;
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
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
            border-bottom: 2px solid transparent;
          }

          .tab-btn.active {
            border-bottom-color: #262626;
          }

         

          .content-grid {
            padding: 10px;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }
       
          .story-card {
            max-width: 200px;
            flex: 1 1 170px;
            cursor: pointer;
            transition: transform 0.2s ease;
          }

          .username {
            font-size: 20px;
            font-weight: 600;
            margin: 0;
          }

          .bio {
            color: #8e8e8e;
            font-size: 14px;
            margin: 4px 0 0 0;
          }

          @media screen and (max-width: 768px){
          .story-card {
            max-width: 50%;
            flex: 1 1 150px;
            cursor: pointer;
            transition: transform 0.2s ease;
          }
          }
        `}
      </style>

      <div className={`profile-container bg-transparent`}>
        {/* Profile Info */}
        <div className={`profile-info ${mode=="light"?"text-dark":"text-white"}`}>
          <div className="d-flex flex-column">
            <div className="d-flex align-items-center">
              <div className="avatar-container">
                <div className="avatar-ring">
                  <div className="avatar-inner">
                    <div className="avatar-img">
                      <img
                        src={userData?.user?.profileImage || "/profile.webp"}
                        alt={userData?.user?.name ||"You"}
                        onError={(e)=>e.target.src="/profile.webp"}
                      />
                    </div>
                  </div>
                </div>
                <div className="status-indicator"></div>
              </div>

              <div className="flex-grow-1">
                <h2 className="username">{userData?.user?.name || "User"}</h2>
                <p className="bio">{userData?.user?.handle || "@user"}</p>
               
              </div>
              <Dropdown>
                <Dropdown.Toggle
                  as="button"
                  className="border-0 bg-transparent"
                >
                  <MoreVertical
                    color={mode === "light" ? "black" : "white"}
                    size={25}
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu className="position-absolute language">
                  <Dropdown.Item onClick={() => dispatch(logout())}>
                    <LogOut size={17} className="mx-1" /> {t("log out")}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>

          {/* Stats */}
          <div className={`stats-container ${mode=="dark"?"bg-secondary text-light":"bg-light text-dark"}`}>
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
        <div className={`tabs-container ${mode!="light"?"bg-secondary":""} text-white`}>
          <div className="d-flex" style={{color:"white"}}>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  name={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`tab-btn ${mode=="light"?"text-dark":"text-light"} ${activeTab === tab.key ? "fw-bold border-bottom border-4" : ""}`}
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
            userData?.questions?.length === 0 ? (
              <h1 className="w-100 py-5 text-center">{t("no data found")}</h1>
            ) : (
              userData?.questions?.map((ques, index) => (
                <SingleCard key={index} ques={ques} />
              ))
            )
          ) : activeTab=="answers"? (userData?.answers?.length===0 ? (
            <h1 className="w-100 py-5 text-center">{t("no data found")}</h1>
          ) : (
            userData?.answers?.map((ans, index) => (
              <SingleCard key={index} type="ans" ques={ans} />
            ))
          )):(userData?.savedItems?.length===0 ? (
            <h1 className="w-100 py-5 text-center">{t("no data found")}</h1>
          ) : (
            userData?.savedItems?.map((ans, index) => (
              <SingleCard key={index} type="saved" ques={ans} />
            ))
          ))}
        </div>
      </div>
    </>
  );
};

export default Profile;

const SingleCard = ({ ques,type }) => {
  const navigate = useNavigate();

  const handleNavigate=()=>{
    if(ques.targetType=="Answer"){
    navigate(`/detail/${[post.id, story.id].join(",")}`)}
  
  else{
    navigate(`/question/${ques.targetId}`)
  }
}


  return (
    <div
      className={`story-card gradient-1 text-decoration-none`}
      onClick={() => handleNavigate()}
    >
      <div className="d-flex flex-column h-100 story-card-main">
       {type=="ans"? <p className="text-center Answer">{ques.answerText}</p>:type=="saved"?<p className="text-center Answer">{ques.descriptions || ques.title}</p>:
        <p className="text-center Answer">{ques.questionText || ques.descriptions}</p>}
        <div className="story-footer">
          <div className="story-views ps-2">
            <Eye size={16} className="me-2" />
            {ques.totalViews || 0}
          </div>
        </div>
      </div>
    </div>
  );
};
