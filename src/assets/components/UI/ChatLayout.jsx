import React, { useContext, useEffect, useState, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import "../../../App.css";
import Footer from "../common/Footer";
import ThemeContext from "../../services/ThemeContext";
import "../../style/chat.css";
import { Ban, Plus, Search, Check, X } from "lucide-react";
import SidebarContext from "../../services/SidebarContext";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../services/slices/otherSlice";
import { fetchPosts } from "../../services/slices/postSlice";
import { useTranslation } from "react-i18next";
import { Dropdown, Offcanvas, Spinner, Tab, Tabs } from "react-bootstrap";
import { backgrounds, colors } from "../WhatsappChat";
import toast from "react-hot-toast";
import { Keyboard, Mousewheel, Virtual } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import axios from "axios";
import { login } from "../../services/slices/userSlice";
import { onlyTwo } from "../Home";

const ChatLayout = () => {
  const loc = useLocation();
  const { showSidebar, setShowSidebar } = useContext(SidebarContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedCat, setSelectedCat] = useState(0);
  const [showNew, setShowNew] = useState(false);
  const [showBg, setShowBg] = useState(false);
  const [key, setKey] = useState("Gradient");
  const [searchQuery, setSearchQuery] = useState("");
  const [posting, setPosting] = useState(false);
  const [mobile, setMobile] = useState(window.innerWidth < 700);
  const [initialSlide, setInitialSlide] = useState(0);
  const [selectedChatColor, setSelectedChatColor] = useState("bg-white text-dark");
  const swiperRef = useRef(null);

  const { posts, loading, error } = useSelector((state) => state.post);
  const { t } = useTranslation();
  const { mode, chatColor, setChatColor, background, setBackground,mainLanguage } =
    useContext(ThemeContext);
  const {
    categories,
    loading: catLoading,
    error: catError,
  } = useSelector((state) => state.other);

   const {
      userData,
      loggedIn,
      loading: authLoading,
      error: authError,
    } = useSelector((state) => state.user);


      useEffect(() => {
        if (!loggedIn) {
          const googleData = JSON.parse(localStorage.getItem("googleUserData"));
          if (googleData) {
            dispatch(
              login({
                handle: `@${googleData?.email?.split("@")[0]}`,
                googleData: googleData,
              })
            );
          }
        }
      }, []);

  const [postData, setPostData] = useState({
    title: "",
    description: "",
    background: "",
    language:localStorage.getItem("i18nextLng") || "en"
  });

  const [appliedTheme, setAppliedTheme] = useState({
    background: "",
    chatColor: "bg-light text-dark",
  });

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  useEffect(() => {
    dispatch(
      fetchPosts({
        search: searchQuery,
        nicheId: selectedCat,
      })
    );
  }, [searchQuery, selectedCat]);

  // Check if we're on welcome screen (no chat ID in path)
  const welcome =
    !(loc.pathname.split("/").length > 3) &&
    loc.pathname.split("/").includes("live");

  // Handle search input
  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (mobile && viewport) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      );
    } else if (viewport) {
      viewport.setAttribute("content", "width=device-width, initial-scale=1.0");
    }
  }, [mobile]);

  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setPostData((pre) => ({
      ...pre,
      [name]: value,
    }));
  };

  const createChat = async () => {
    try {
      setPosting(true)
      const data={
         conversationCode: `C${Math.floor(100 + Math.random() * 900)}`,
          userId: userData?.user?.userId,
          topic: postData.title,
          description: postData.description,
          language: "english",
           nicheId: 1,
           askTo: 3,
          background: appliedTheme.background,
          theme:appliedTheme.chatColor,
          music: ""
        }
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/Conversations`,
        data
      );
      setShowNew(false);
      navigate(`/live/chat/${res.data}`)
    } catch (e) {
      console.log("Not post", e);
    }
    finally{
      setPosting(false)
    }
  };

  const handlePost = () => {
    if(!loggedIn){
navigate("/login")
    }
    else{
    createChat()
    }

  };

  // Handle resize to track mobile state
  useEffect(() => {
    const handleResize = () => {
      setMobile(window.innerWidth < 700);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle sidebar visibility based on screen size and route
  useEffect(() => {
    if (mobile) {
      setShowSidebar(welcome);
    } else {
      setShowSidebar(true);
    }
  }, [mobile, welcome, setShowSidebar]);

  const handleBackgroundClick = (index) => {
    setInitialSlide(index);
    setShowBg(true);
  };

  const getAllBackgrounds = () => {
    return [
      ...backgrounds.Gradient,
      ...backgrounds.Pattern,
      ...backgrounds.Animated,
    ];
  };

  useEffect(() => {
    if (showBg && swiperRef.current) {
      setTimeout(() => {
        swiperRef.current.swiper.slideTo(initialSlide);
      }, 100);
    }
  }, [showBg, initialSlide]);

  return (
    <>
      <style>{`
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
        }
        
        .chat-container {
          height: 100vh;
          width: 100%;
          margin: 0 auto;
          background-color: #ffffffff;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow-y: hidden;
        }
          
        .off.show {
          border-radius: 20px 20px 0 0;
          width: 50%;
        }

        .chat-header {
          background-color: #ffffffff;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 1px 2px rgba(0,0,0,0.3);
          position: absolute;
          z-index: 20;
          width: 100%;
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .back-arrow {
          color: #000000ff;
          cursor: pointer;
          font-size: 24px;
        }
        
        .avatar {
          width: 40px;
          aspect-ratio: 1/1;
          height: 40px;
          border-radius: 50%;
          background-color: #667781;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 500;
          font-size: 14px;
        }
        
        .contact-info h6 {
          margin: 0;
          color: #000000ff;
          font-size: 16px;
          font-weight: 400;
        }
        
        .contact-info small {
          color: #8696a0;
          font-size: 10px;
        }
        
        .header-icons {
          display: flex;
          gap: 24px;
          color: #000000ff;
        }
        
        .chat-body {
          margin: 60px 0;
          width: 100% !important;
          flex: 1;
          overflow-y: auto;
          padding: 12px 8px;
        }

        .message-wrapper {
          display: flex;
          margin-bottom: 8px;
          padding: 0 4px;
        }
        
        .message-wrapper.sent {
          justify-content: flex-end;
        }
        
        .message-wrapper.received {
          justify-content: flex-start;
        }
        
        .message-box {
          max-width: 75%;
          padding: 8px 10px;
          border-radius: 8px;
          position: relative;
          word-wrap: break-word;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        
        .message-box.sent {
          border-bottom-right-radius: 2px;
          backdrop-filter: blur(10px);
        }
        
        .message-box.received {
          background-color: #ffffffff;
          color: #000000ff;
          border-bottom-left-radius: 2px;
        }
        
        .message-text {
          font-size: 14px;
          line-height: 19px;
          margin-bottom: 4px;
          white-space: pre-wrap;
        }
        
        .message-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 4px;
          margin-top: 4px;
        }
        
        .message-time {
          font-size: 11px;
          color: #c8c8c8ff;
        }
        
        .check-marks {
          width: 16px;
          height: 16px;
          color: #00b3ffff;
        }
        
        .chat-footer {
          background-color: #ffffffff;
          padding: 8px 16px;
          position: absolute;
          border-bottom: 1px solid black;
          bottom: 0px;
          width: 100%;
        }
        
        .input-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .input-container {
          flex: 1;
          background-color: #ffffffff;
          border-radius: 24px;
          border: 1px solid lightgrey;
          display: flex;
          align-items: center;
          padding: 8px 16px;
        }
        
        .input-container input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #000000ff;
          font-size: 15px;
          padding: 0 12px;
        }
        
        .input-container input::placeholder {
          color: #8696a0;
        }
        .input-container:hover .input-icon{
          background-color: #4d96dfcb !important;
        }
        .input-container:hover  {
          border: 1px solid #4d96dfcb;
        }
        
        .input-icon {
          width: 24px;
          height: 24px;
          color: #8696a0;
          cursor: pointer;
        }
        
        .mic-button {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          aspect-ratio: 1/1;
        }
          
        .notificationWhatsApp {
          position: relative;
        }
        
        .bgparent {
          padding-top: 10px;
          width: 100%;
          overflow-x: auto;
        }
        
        .box {
          min-width: 80px;
          height: 110px;
          border-radius: 10px;
          user-select: none;
          cursor: pointer;
          transition: transform 0.2s;
        }

       
        
        .box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 10px;
        }

        .NotificationCountWhatsApp {
          background-color: red;
          text-align: center;
          color: white;
          margin: auto;
          font-size: 11px;
          font-weight: bold;
          padding-top: 2px;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          position: absolute;
          top: -5px;
          left: 10px;
        }
        
        
        .mic-button svg {
          width: 24px;
          height: 24px;
          color: #ffffffff;
        }

        .box1 {
          display: flex;
          align-items: center;
          height: 35px;
        }

        .join {
          font-size: 10px;
        }

        .smallNavBar {
          width: inherit;
          border-right: 1px solid black;
          top: 11;
          z-index: 9;
        }

        .smallNavBar::-webkit-scrollbar {
          display: none;
        }

        /* Preview Chat Styles */
        .preview-chat-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 16px;
          gap: 12px;
          overflow-y: auto;
        }

        .preview-message {
          display: flex;
          margin-bottom: 12px;
          animation: slideIn 0.3s ease-in;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .preview-message.sent {
          justify-content: flex-end;
        }

        .preview-message.received {
          justify-content: flex-start;
        }

        .preview-bubble {
          max-width: 70%;
          padding: 10px 14px;
          border-radius: 18px;
          font-size: 14px;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .preview-bubble.sent {
          border-top-right-radius: 4px;
        }

        .preview-bubble.received {
          border-top-left-radius: 4px;
          background-color: rgba(255, 255, 255, 0.7);
          color: #000;
        }

        .swiper {
          width: 100%;
          height: 100%;
        }

        .swiper-slide {
          width: 100%;
          height: 100%;
        }

        .color-selector {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 16px;
          padding: 12px;
          background: rgba(0, 0, 0, 0.05);
          border-radius: 12px;
        }

        .color-option {
          width: 50px;
          height: 50px;
          border-radius: 25px;
          border: 3px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
        }

        .color-option:hover,
        .color-option.selected {
          border-color: #0d6efd;
          transform: scale(1.1);
        }

        .preview-footer {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px;
          z-index:10;
          background: rgba(255, 255, 255, 0.9);
          border-top: 1px solid #e0e0e0;
        }
      `}</style>

      <div className="container-fluid p-0">
        {/* Sidebar */}
        <div
          className={`LeftSlider bg-light ${
            showSidebar ? (mobile ? "w-100" : "") : "d-none"
          }`}
        >
          <div className="w-100 p-2 ps-3 fs-5">{t("all conversations")}</div>

          <div className="input-container m-2 mt-1">
            <Search />
            <input
              type="search"
              value={searchQuery}
              onChange={handleChange}
              placeholder={t("search conversations")}
              className="search-input text-dark"
            />
            {searchQuery.trim() !== "" && (
              <X
                size={20}
                onClick={() => setSearchQuery("")}
                style={{
                  backgroundColor: "lightgrey",
                  borderRadius: "50%",
                  border:"1px solid red",
                  padding: "3px",
                }}
              />
            )}
          </div>
          <div
            className={`container-fluid d-flex justify-content-start overflow-auto smallNavBar gap-1 ${
              mode === "light" ? "bg-light text-dark" : "bg-dark text-light"
            }`}
          >
            <div
              className={`box1 px-3 rounded-3 m-1  ${
                selectedCat === 0 ? "bg-dark text-white" : ""
              }`}
              style={{ cursor: "pointer",backgroundColor: "#F2F2F2" }}
              onClick={() => setSelectedCat(0)}
            >
              {t("all")}
            </div>

            {categories?.map((cat) => (
              <div
                key={cat.nicheId}
                className={`box1 px-3 rounded-3 m-1 ${
                  selectedCat === cat.nicheId ? "bg-dark text-white" : ""
                }`}
                style={{ whiteSpace: "nowrap", cursor: "pointer" ,backgroundColor: "#F2F2F2"}}
                onClick={() => setSelectedCat(cat.nicheId)}
              >
                {mainLanguage=="en"?cat.title:onlyTwo(cat.description)}
              </div>
            ))}
          </div>
          <div className="allchatparent overflow-scroll pt-5">
            {posts
              .filter((post) => post.type === "CD")
              .map((msg) => (
                <div
                  key={msg.id}
                  className="border d-flex align-items-center justify-content-between cursor-pointer"
                  onClick={() => {
                    navigate(`/live/chat/${msg?.id}`);
                    if (mobile) setShowSidebar(false);
                  }}
                >
                  <div className="title ps-3 py-2 d-flex align-items-center">
                    <div className="avatar me-2">
                      <img
                        src={msg?.avatar || "/profile.webp"}
                        onError={(e) => (e.target.src = "/profile.webp")}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                        alt=""
                      />
                    </div>
                    <div className="lh-0 d-flex flex-column justify-content-center overflow-hidden">
                      <span>{msg.title}</span>
                      <small className="p-0 m-0 text-dark" style={{fontSize:"12px"}}>{msg.handle}</small>
                    </div>
                  </div>
                  <small className="join text-center p-3">01/01/2025</small>
                </div>
              ))}
          </div>
          <div className="PlusParent w-100 position-relative">
            <div className="PlusBtn btn btn-dark" onClick={() => setShowNew(true)}>
              <Plus />
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className={`${showSidebar ? "chatWindow" : "chatWindowHide"}`}>
          <Outlet />
        </div>
      </div>

      {/* First Offcanvas - Create Chat */}
      <Offcanvas
        placement="bottom"
        keyboard={true}
        scroll={true}
        className="offNewChat"
        backdrop={true}
        show={showNew}
        onHide={() => setShowNew(false)}
        style={{
          marginLeft: !mobile ? "350px" : "0",
          width: !mobile ? "calc(100vw - 350px)" : "100%",
          zIndex: 100000,
          height: "100vh !important",
        }}
      >
        <Offcanvas.Header closeButton className="off-header">
          <div className="d-flex w-100 justify-content-between">
            <Offcanvas.Title>New Chat</Offcanvas.Title>
            <button
              className="btn btn-dark rounded-4 me-2"
            style={{paddingTop:"5px"}}
              onClick={() => {
                setPostData((pre) => ({
                  ...pre,
                  background: pre.background, // Ensure postData is set
                }));
                setAppliedTheme({
                  background: postData.background,
                  chatColor: selectedChatColor,
                });
                handlePost()
                
              }}
              disabled={postData.title.trim()===""}
            >
              Create
            </button>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body style={{ height: "100vh", overflow: "auto" }}>
          <div className="form d-flex flex-column mb-4">
            <label htmlFor="" className="mt-1">
              Topic
            </label>
            <input
              type="text"
              name="title"
              onChange={(e) => handlePostChange(e)}
              className="p-1 rounded-2 border ps-3 my-1 bg-transparent"
              placeholder="Topic..."
            />
            {/* <label className="mt-4"  htmlFor="">Conversation Langauge</label>
            <select name="language" className="p-1 rounded-2 border ps-3 my-1 bg-transparent" id="" value={postData.language} onChange={(e)=>handlePostChange(e)}>
              <option value="hi">हिन्दी</option>
              <option value="en">English</option>
            </select> */}
            <label htmlFor="" className="mt-4">
              Description
            </label>
            <textarea
              type="text"
              name="description"
              onChange={(e) => handlePostChange(e)}
              className="p-1 rounded-2 border ps-3 my-1 bg-transparent"
              placeholder="Description..."
            />
          </div>

          <div className="d-flex gap-2 mb-3">
            <div
              className="btn btn-outline-danger btn-sm py-1 apply-theme-btn"
              style={{color:"#fd8181ff",borderColor:"#fd8181ff"}}
              onClick={() => {
                setPostData((pre) => ({ ...pre, background: "" }));
              }}
            >
              Default Theme
            </div>
            <div
              className="btn btn-outline-danger btn-sm py-1 apply-theme-btn"
              style={{color:"#fd8181ff",borderColor:"#fd8181ff"}}
              onClick={() => {
                setPostData((pre) => ({ ...pre, background: "#f1f1f1" }));
                setChatColor("ChatWhatsappTheme")
              }}
            >
              Whatsapp Theme
            </div>
          </div>

          <div className="changeBg w-50 fw-bold mt-4">Background</div>

          <Tabs
            id="justify-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3 mt-2"
            justify
          >
            <Tab eventKey="Gradient" title="Gradient">
              <div className="bgparent py-1 d-flex gap-2">
                <div
                  className="box border justify-content-center d-flex align-items-center position-relative"
                  onClick={() =>
                    setPostData((pre) => ({ ...pre, background: "" }))
                  }
                  style={{
                    outline:
                      postData.background === "" ? "2px solid #28a745" : "none", // Changed
                  }}
                >
                  <Ban size={30} />
                  {postData.background === "" && ( // Changed
                    <Check
                      size={24}
                      color="#28a745"
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        padding: "2px",
                      }}
                    />
                  )}
                </div>
                {backgrounds.Gradient.map((grad, idx) => (
                  <div
                    key={idx}
                    className="box overflow-hidden position-relative"
                    onClick={() => {
                      setPostData((pre) => ({ ...pre, background: grad })); // This updates postData
                      handleBackgroundClick(idx);
                    }}
                    style={{
                      outline:
                        postData.background === grad
                          ? "2px solid #28a745"
                          : "none", // Changed
                    }}
                  >
                    <div
                      className={`${grad}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "10px",
                      }}
                    />
                    {postData.background === grad && ( // Changed
                      <Check
                        size={24}
                        color="#28a745"
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          backgroundColor: "white",
                          borderRadius: "50%",
                          padding: "2px",
                          zIndex: 10,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </Tab>

            <Tab eventKey="Pattern" title="Pattern">
              <div className="bgparent d-flex gap-2">
                <div
                  className="box border justify-content-center d-flex align-items-center position-relative"
                  onClick={() =>
                    setPostData((pre) => ({ ...pre, background: "" }))
                  }
                  style={{
                    outline:
                      postData.background === "" ? "2px solid #28a745" : "none",
                  }}
                >
                  <Ban size={30} />
                  {postData.background === "" && (
                    <Check
                      size={24}
                      color="#28a745"
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        padding: "2px",
                      }}
                    />
                  )}
                </div>
                {backgrounds.Pattern.map((pattern, idx) => (
                  <div
                    key={idx}
                    className="box overflow-hidden position-relative"
                    onClick={() => {
                      setPostData((pre) => ({ ...pre, background: pattern }));
                      handleBackgroundClick(backgrounds.Gradient.length + idx);
                    }}
                    style={{
                      outline:
                        postData.background === pattern
                          ? "2px solid #28a745"
                          : "none",
                    }}
                  >
                    <div
                      className={`pattern ${pattern}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "10px",
                      }}
                    />
                    {postData.background === pattern && (
                      <Check
                        size={24}
                        color="#28a745"
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          backgroundColor: "white",
                          borderRadius: "50%",
                          padding: "2px",
                          zIndex: 10,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </Tab>

            <Tab eventKey="Animated" title="Animated">
              <div className="bgparent d-flex gap-2">
                <div
                  className="box border justify-content-center d-flex align-items-center position-relative"
                  onClick={() =>
                    setPostData((pre) => ({ ...pre, background: "" }))
                  }
                  style={{
                    outline:
                      postData.background === "" ? "2px solid #28a745" : "none",
                  }}
                >
                  <Ban size={30} />
                  {postData.background === "" && (
                    <Check
                      size={24}
                      color="#28a745"
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        padding: "2px",
                      }}
                    />
                  )}
                </div>
                {backgrounds.Animated.map((anim, idx) => (
                  <div
                    key={idx}
                    className="box overflow-hidden position-relative"
                    onClick={() => {
                      setPostData((pre) => ({ ...pre, background: anim }));
                      handleBackgroundClick(
                        backgrounds.Gradient.length +
                          backgrounds.Pattern.length +
                          idx
                      );
                    }}
                    style={{
                      outline:
                        postData.background === anim
                          ? "2px solid #28a745"
                          : "none",
                    }}
                  >
                    <div
                      className={`anim ${anim}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "10px",
                      }}
                    />
                    {postData.background === anim && (
                      <Check
                        size={24}
                        color="#28a745"
                        style={{
                          position: "absolute",
                          top: "5px",
                          right: "5px",
                          backgroundColor: "white",
                          borderRadius: "50%",
                          padding: "2px",
                          zIndex: 10,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </Tab>
          </Tabs>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Second Offcanvas - Preview with Swiper */}
      <Offcanvas
        placement="bottom"
        keyboard={true}
        scroll={true}
        className="offNewChat"
        backdrop={true}
        show={showBg}
        onHide={() => setShowBg(false)}
        style={{
          marginLeft: !mobile ? "350px" : "0",
          width: !mobile ? "calc(100vw - 350px)" : "100%",
          zIndex: 100001,
          height: "100vh !important",
        }}
      >
        <Offcanvas.Header closeButton className="off-header">
          <div className="d-flex w-100 justify-content-between align-items-center">
            <Offcanvas.Title>Preview</Offcanvas.Title>
            <button
              className="btn btn-dark rounded-4 me-2"
              style={{ paddingTop: "5px" }}
              onClick={() => {
                const currentSlide = swiperRef.current?.swiper.activeIndex || 0;
                const allBgs = getAllBackgrounds();
                setAppliedTheme({
                  background: allBgs[currentSlide],
                  chatColor: selectedChatColor,
                });
                setPostData((pre) => ({
                  ...pre,
                  background: allBgs[currentSlide],
                }));
                
                setShowBg(false);
              }}
            >
              Apply
            </button>
          </div>
        </Offcanvas.Header>
        <Offcanvas.Body
          style={{ height: "100vh", padding: 0, position: "relative" }}
        >
          <Swiper
            ref={swiperRef}
            direction="horizontal"
            slidesPerView={1}
            mousewheel={{
              forceToAxis: true,
              releaseOnEdges: true,
              sensitivity: 1,
            }}
            initialSlide={initialSlide}
            spaceBetween={0}
            modules={[Virtual, Mousewheel, Keyboard]}
            keyboard={{ enabled: true, onlyInViewport: true }}
            style={{ height: "calc(100vh - 120px)" }}
          >
            {getAllBackgrounds().map((bg, idx) => (
              <SwiperSlide key={idx}>
                <div
                  className={`w-100 h-100 d-flex flex-column ${
                    bg.includes("Anim")
                      ? "anim"
                      : bg.includes("PaternBg")
                      ? "pattern"
                      : ""
                  } ${bg}`}
                  style={{ height: "100%" }}
                >
                  {/* Chat Preview */}
                  <div className="preview-chat-container">
                    {/* Received Message */}
                    <div className="preview-message received">
                      <div
                        className="preview-bubble received"
                        style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
                      >
                        Hello! How are you? 👋
                      </div>
                    </div>

                    {/* Sent Message */}
                    <div className="preview-message sent">
                      <div
                        className={`preview-bubble sent ${selectedChatColor}`}
                       
                      >
                        I'm doing great! Thanks for asking! 😊
                      </div>
                    </div>

                    {/* Received Message */}
                    <div className="preview-message received">
                      <div
                        className="preview-bubble received"
                        style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
                      >
                        That's awesome! Want to chat?
                      </div>
                    </div>

                    {/* Sent Message */}
                    <div className="preview-message sent">
                      <div
                        className={`preview-bubble sent ${selectedChatColor}`}
                       
                      >
                        Sure, I'd love to!
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Color Selector in Footer */}
          <div className="preview-footer">
            <div className="fw-bold mb-2">Chat Color</div>
            <div className="color-selector">
              <div
                className={`color-option ${
                  selectedChatColor==="bg-white text-black" ? "selected" : ""
                }`}
                style={{ backgroundColor: "#ffffffff" }}
                onClick={() =>
                  setSelectedChatColor("bg-white text-black")
                }
                title="White"
              />
              {colors.map((col,index) => (
                <div
                  key={index}
                  className={`color-option ${
                    selectedChatColor[index] === index ? "selected" : ""
                  } ${col}`}
                  
                  onClick={() => setSelectedChatColor(col)}
                  title={`Color ${col}`}
                />
              ))}
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <Footer />
    </>
  );
};

export default ChatLayout;
