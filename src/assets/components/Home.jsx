import {
  CirclePlus,
  Compass,
  Heart,
  MessageCircle,
  Plus,
  Share,
  ThumbsUp,
  X,
  Youtube,
} from "lucide-react";
import React, {
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
  useContext,
  use,
} from "react";
import { toast as myToast } from "react-toastify";
import { QRCodeSVG } from "qrcode.react";
import { Eye, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../services/slices/postSlice";
import {
  Dropdown,
  Offcanvas,
  Spinner,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { RiShareForwardLine } from "react-icons/ri";
import { FaRegFlag } from "react-icons/fa6";
import ThemeContext from "../services/ThemeContext";
import toast from "react-hot-toast";
import { login, setUserFromStorage } from "../services/slices/userSlice";
import { getCategories } from "../services/slices/otherSlice";
import SearchContext from "../services/SearchContext";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../../index.css";
import { isQuestion } from "./WhatsappChat";
import { RWebShare } from "react-web-share";
import QRCode from "react-qrcode-logo";
import { FacebookShareCount } from "react-share";
const Home = () => {
const { mode, setMode } = useContext(ThemeContext);
  
  // myToast("Success")
  return (
    <div>
      <BootstrapFeed mode={mode} />
    </div>
  );
};

export default Home;

const BootstrapFeed = ({ mode }) => {
  const { posts, loading, error } = useSelector((state) => state.post);
  const [selectedCat, setSelectedCat] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { search, setSearch } = useContext(SearchContext);
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

  const handleSave = (targetType, targetId) => {
    if (!loggedIn) {
      navigate("/login");
    } else {
      saveAsFavorite(targetType, targetId);
    }
  };
  const handleReport = (targetType, targetId, reason) => {
    if (!loggedIn) {
      navigate("/login");
    } else {
      report(targetType, targetId, reason);
    }
  };

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

  useEffect(() => {
    if(!posts){
    dispatch(
      fetchPosts({
        search,
        nicheId: selectedCat,
      })
    );
  }
  }, [search, selectedCat]);

  useEffect(() => {
    dispatch(getCategories());
  }, []);


  useEffect(() => {
    if (error || catError) {
      console.error(error || catError);
    }
  }, [error, catError]);

  if (loading || catLoading || authLoading) {
    return (
      <div className="Loader w-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" />
      </div>
    );
  }

    if (error) {
    return (
      <div
        className="d-flex justify-content-center align-items-center flex-column"
        style={{ height: "100vh" }}
      >
        <h3>Post not found</h3>
        <button className="btn btn-primary mt-3" onClick={() =>window.location.reload()}>
          Refresh
        </button>
      </div>
    );
  }


  return (
    <>

      <div
        className={`container-fluid d-flex justify-content-start overflow-auto smallNavBar gap-1 ${
          mode === "light" ? "bg-light text-dark" : "bg-dark text-light"
        }`}
      >
        <div
          className={`box px-3 category-box m-1 ${
            selectedCat === 0 ? "bg-dark text-white" : "text-dark"
          } `}
          style={{ cursor: "pointer" }}
          onClick={() => setSelectedCat(0)}
        >
          {t("all")}
        </div>

        {categories?.map((cat) => (
          <div
            key={cat.nicheId}
            className={`box category-box px-2  m-1 ${
              selectedCat === cat.nicheId ? "bg-black text-white" : "text-dark"
            }`}
            style={{ whiteSpace: "nowrap", cursor: "pointer" }}
            onClick={() => setSelectedCat(cat.nicheId)}
          >
            {cat.title}
          </div>
        ))}
      </div>

      <div className="feed-container bg-transparent container-fluid p-0 pt-5">
        {posts.length == 0 ? (
          <h1 className="w-100 text-center my-5">No post available</h1>
        ) : (
          posts?.map((post) =>
            post.type == "CD" ? (
              <SingleConversation
                userData={userData}
                loggedIn={loggedIn}
                post={post}
              />
            ) : (
              <SinglePost userData={userData} loggedIn={loggedIn} post={post} />
            )
          )
        )}
      </div>
    </>
  );
};

const SinglePost = ({ userData, post, loggedIn, index }) => {
  const [activeOffcanvas, setActiveOffcanvas] = useState(null);
  const [following, setFollowing] = useState(false);
  const { mode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [showSuccessFavorite, setShowSuccessFavorite] = useState(true);

  const { t } = useTranslation();

  const follow = async (userId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/Social/follow`,
        {
          followTo: userId,
        },
        {
          headers: {
            "X-User-Id": userData.user.userId,
          },
        }
      );
      setFollowing((pre)=>!pre);
    } catch (e) {
      console.log("Error to follow", e);
      toast.error(e.message || "Failed to follow");
    }
  };

  const handleSave = (targetId) => {
    if (!loggedIn) {
      navigate("/login");
    } else {
      saveAsFavorite("Question", targetId, userData.user.userId);
      setShowPostMenu(false);
      setShowSuccessFavorite(true);
    }
  };

  const handleReportOption = (option, targetId) => {
    if (!loggedIn) {
      navigate("/login");
    } else {
      report("Question", targetId, option, userData.user.userId);
      setActiveOffcanvas(null);
    }
  };
  const getUserProfile = async (handle) => {
    try {
      const url = `${
        import.meta.env.VITE_API_BASE_URL
      }/Users/${encodeURIComponent(handle)}`;
      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
      return null;
    }
  };

  const handleFollow = async (handle) => {
    if (!loggedIn) {
      navigate("/login");
    } else {
      let userProfile = await getUserProfile(handle);
      if (userProfile) {
        follow(userProfile.user.userId);
      }
    }
  };

  useEffect(() => {
    if (loggedIn) {
      userData?.following?.forEach((Sfollowing) => {
        if (Sfollowing?.handle == post.handle) {
          setFollowing(true);
        }
      });
    }
  }, [loggedIn, userData]);



  
  return (
    <>
      <div key={post.id} className="post-card mb-4 bg-transparent">
        {/* Post Header */} 
        <div className="d-flex align-items-center p-3 border-bottom bg-transparent">
          <div className="flex-grow-1 d-flex flex-column justify-content-center ps-3">
            <div className="d-flex align-items-center">
              <div
                className="position-relative avatar-pic"
                onClick={() => navigate(`/userprofile/${post.handle}`)}
              >
                <img
                  src={post.avatar}
                  onError={(e) => (e.target.src = "/profile.webp")}
                  className="avatar rounded-circle"
                />
              </div>
              <small
                className="px-2 cursor-pointer"
                onClick={() => navigate(`/userprofile/${post.handle}`)}
              >
                {post.handle}
              </small>

             {loggedIn? (userData?.user?.handle!=post?.handle && <div
                className={`btn ${
                  mode == "light"
                    ? following
                      ? "btn-outline-dark"
                      : "btn-dark"
                    : following
                    ? "btn-outline-light"
                    : "btn-light"
                } px-2`}
                style={{ padding: "0", fontSize: "15px" }}
                onClick={() => handleFollow(post.handle)}
              >
                {following ? t("following") : t("follow")}
              </div>):<div
                className={`btn ${
                  mode == "light"
                    ? following
                      ? "btn-outline-dark"
                      : "btn-dark"
                    : following
                    ? "btn-outline-light"
                    : "btn-light"
                } px-2`}
                style={{ padding: "0", fontSize: "15px" }}
                onClick={() => handleFollow(post.handle)}
              >
                {following ? t("following") : t("follow")}
              </div>}
            </div>
            <div
              className="post-description mb-0 d-flex justify-content-between align-items-center fw-bold pt-3"
              onClick={() => navigate(`/question/${post.id}`)}
            >
              {post.description}
            </div>
          </div>
          <div className="d-flex flex-column justify-content-center">
            <MoreVertical onClick={() => setShowPostMenu(true)} />
          </div>
        </div>

        {/* Post Description */}
        <div className="px-3 py-3"></div>

        {/* Horizontal Scrolling Stories */}
        <div className="pb-3">
          <div className="story-container overflow-y-hidden d-flex gap-3 px-3">
            {post?.stories
              ?.filter((story) => story.answer !== null)
              .map((story, storyIndex) => (
                <SingleCard
                  key={story.id}
                  post={post}
                  story={story}
                  storyIndex={storyIndex}
                  loggedIn={loggedIn}
                  userData={userData}
                />
              ))}
            <ReplyCard postId={post?.id} />
          </div>
        </div>
      </div>

      {/* Post Menu Offcanvas */}
      <Offcanvas
        show={showPostMenu}
        onHide={() => setShowPostMenu(false)}
        placement="bottom"
        className={`offcanvas-report ${
          mode == "dark" ? "bg-dark text-light" : ""
        }`}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Question Actions</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="item py-3" onClick={() => handleSave(post.id)}>
            <Heart size={30} className="mx-4" style={{ marginTop: "-4px" }} />
            {t("mark as favorite")}
          </div>

          {/* <RWebShare
            data={{
              text: post.description,
              url: shareLoc + "/" + "question/" + post.id,
              
            }}
            title="Share via"
          >
            <div className="item py-3">
              <RiShareForwardLine size={30} className="mx-4" />
              {t("share")}
            </div>
          </RWebShare> */}

          <div className="item py-3" onClick={() => handleShare(post)}>
            <RiShareForwardLine size={30} className="mx-4" />
            {t("share")}
          </div>

          <div
            className="item py-3"
            onClick={() => setActiveOffcanvas("report")}
          >
            <FaRegFlag size={30} className="mx-4" />
            {t("report")}
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <Offcanvas
        show={activeOffcanvas === "report"}
        onHide={() => setActiveOffcanvas(null)}
        placement="bottom"
        className={`offcanvas-report-option ${
          mode == "dark" ? "bg-dark text-light" : ""
        }`}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Report Answer</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {reportOptions.map((option, index) => (
            <div
              key={index}
              className="item py-3"
              onClick={() => handleReportOption(option, post.id)}
            >
              <label
                htmlFor={`report${index}`}
                className="ms-2"
                style={{ fontSize: "16px" }}
              >
                {option}
              </label>
            </div>
          ))}
        </Offcanvas.Body>
      </Offcanvas>

      {/* Success Toast - Only shows for this specific post */}
      {/* <ToastContainer
        className="p-3 d-flex justify-content-center"
        position="bottom-center"
        style={{ zIndex: 1, width: "100%" }}
      >

      
        <Toast 
          className="favoriteSuccess" 
          onClose={() => setShowSuccessFavorite(false)} 
          show={showSuccessFavorite} 
          delay={3000}

        >
          <Toast.Body>
            <div className="d-flex justify-content-between">
              <p>Saved to Favorite</p>
              <div className="text-primary"><p>See list</p></div>
              <X color="white" onClick={() => setShowSuccessFavorite(false)} />
            </div>
          </Toast.Body>
        </Toast>
      </ToastContainer> */}
    </>
  );
};

export const SingleCard = ({ post, story, storyIndex, loggedIn, userData }) => {
  const navigate = useNavigate();
  const { mode } = useContext(ThemeContext);
  const [activeOffcanvas, setActiveOffcanvas] = useState(null);
  const { t } = useTranslation();

  const handleSave = (targetId) => {
    if (!loggedIn) {
      navigate("/login");
    } else {
      saveAsFavorite("Answer", targetId, userData.user.userId);
      setActiveOffcanvas(null);
    }
  };

  const handleReportOption = (option, targetId) => {
    if (!loggedIn) {
      navigate("/login");
    } else {
      report("Answer", targetId, option, userData.user.userId);
      setActiveOffcanvas(null);
    }
  };

  return (
    <div className="position-relative">
      <MoreVertical
        color="white"
        className="position-absolute mt-2 me-2 end-0 z-1 cursor-pointer"
        size={20}
        onClick={() => setActiveOffcanvas("main")}
      />
      <div
        key={story.id}
        className={`story-card ${story?.gradient} text-decoration-none`}
        onClick={() => navigate(`/detail/${[post.id, story.id].join(",")}`)}
      >
        <div className="d-flex flex-column h-100 story-card-main">
          {/* Story Header */}
          <div className="story-header"></div>

          <p className="text-justify Answer">{story.answer}</p>

          {/* Story Footer - Only Views */}
          <div className="story-footer">
            <div className="d-flex align-items-center">
              <div className="avatar-card rounded-5 ms-1">
                <img
                  src={story.avatar || "/profile.webp"}
                  onError={(e) => (e.target.src = "/profile.webp")}
                  alt=""
                />
              </div>
              <small className="text-light w-100">{story.handle}</small>
            </div>
            <div className="d-flex justify-content-between px-3">
              <div className="story-views">
                <ThumbsUp size={16} className="me-2" />
                {story.likes}
              </div>
              <div className="story-views">
                <MessageCircle size={16} className="me-2" />
                {story.comments}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Actions Offcanvas */}
      <Offcanvas
        show={activeOffcanvas === "main"}
        onHide={() => setActiveOffcanvas(null)}
        placement="bottom"
        className={`offcanvas-report ${
          mode == "dark" ? "bg-dark text-light" : ""
        }`}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Answer Actions</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="item py-3" onClick={() => handleSave(story.id)}>
            <Heart size={30} className="mx-4" style={{ marginTop: "-4px" }} />
            {t("mark as favorite")}
          </div>

 <ShareTemplate
                          question={post.description}
                          answer={story}
                          postId={post.id}
                        />

        
          <div
            className="item py-3"
            onClick={() => setActiveOffcanvas("report")}
          >
            <FaRegFlag size={30} className="mx-4" />
            {t("report")}
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Report Options Offcanvas */}
      <Offcanvas
        show={activeOffcanvas === "report"}
        onHide={() => setActiveOffcanvas(null)}
        placement="bottom"
        className={`offcanvas-report-option ${
          mode == "dark" ? "bg-dark text-light" : ""
        }`}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Report Answer</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {reportOptions.map((option, index) => (
            <div
              key={index}
              className="item py-3"
              onClick={() => handleReportOption(option, story.id)}
            >
              <label
                htmlFor={`report${index}`}
                className="ms-2"
                style={{ fontSize: "16px" }}
              >
                {option}
              </label>
            </div>
          ))}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

const SingleConversation = ({ userData, post, loggedIn }) => {
  const [following, setFollowing] = useState(false);
  const { mode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeOffcanvas, setActiveOffcanvas] = useState(null);

  const follow = async (userId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/Social/follow`,
        {
          followTo: userId,
        },
        {
          headers: {
            "X-User-Id": userData.user.userId,
          },
        }
      );
      setFollowing((pre)=>!pre);
    } catch (e) {
      console.log("Error to follow", e);
      toast.error(e.message || "Failed to follow");
    }
  };

  const handleSave = (targetId) => {
    if (!loggedIn) {
      navigate("/login");
    } else {
      saveAsFavorite("C", targetId, userData.user.userId);
      setActiveOffcanvas(null);
    }
  };

  const handleReportOption = (option, targetId) => {
    if (!loggedIn) {
      navigate("/login");
    } else {
      report("C", targetId, option, userData.user.userId);
      setActiveOffcanvas(null);
    }
  };

  const getUserProfile = async (handle) => {
    try {
      const url = `${
        import.meta.env.VITE_API_BASE_URL
      }/Users/${encodeURIComponent(handle)}`;
      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
      return null;
    }
  };

  const handleFollow = async (handle) => {
    if (!loggedIn) {
      navigate("/login");
    } else {
      let userProfile = await getUserProfile(handle);
      if (userProfile) {
        follow(userProfile.user.userId);
      }
    }
  };

  useEffect(() => {
    if (loggedIn) {
      userData?.following?.forEach((Sfollowing) => {
        if (Sfollowing?.handle == post.handle) {
          setFollowing(true);
        }
      });
    }
  }, [loggedIn, userData]);

  return (
    <>
      <div key={post.id} className="post-card mb-4 bg-transparent">
        {/* Post Header */}
        <div className="d-flex align-items-center p-3 border-bottom bg-transparent">
          <div className="flex-grow-1 d-flex flex-column justify-content-center ps-3">
            <div className="d-flex align-items-center">
              <div
                className="position-relative avatar-pic"
                onClick={() => navigate(`/userprofile/${post.handle}`)}
              >
                <img
                  src={post.avatar}
                  onError={(e) => (e.target.src = "/profile.webp")}
                  className="avatar rounded-circle"
                />
              </div>
              <small
                className="px-2 cursor-pointer"
                onClick={() => navigate(`/userprofile/${post.handle}`)}
              >
                {post.handle}
              </small>

         {loggedIn? (userData?.user?.handle!=post?.handle && <div
                className={`btn ${
                  mode == "light"
                    ? following
                      ? "btn-outline-dark"
                      : "btn-dark"
                    : following
                    ? "btn-outline-light"
                    : "btn-light"
                } px-2`}
                style={{ padding: "0", fontSize: "15px" }}
                onClick={() => handleFollow(post.handle)}
              >
                {following ? t("following") : t("follow")}
              </div>):<div
                className={`btn ${
                  mode == "light"
                    ? following
                      ? "btn-outline-dark"
                      : "btn-dark"
                    : following
                    ? "btn-outline-light"
                    : "btn-light"
                } px-2`}
                style={{ padding: "0", fontSize: "15px" }}
                onClick={() => handleFollow(post.handle)}
              >
                {following ? t("following") : t("follow")}
              </div>}
            </div>
            <div
              className="post-description mb-0 d-flex justify-content-between align-items-center pt-3"
              onClick={() => navigate(`/live/chat/${post.id}`)}
            >
              {post.title}
            </div>
          </div>
          <div className="d-flex flex-column justify-content-center">
            <MoreVertical
              onClick={() => setActiveOffcanvas("main")}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>

        {/* Post Description */}
        <div className="px-3 py-3"></div>

        {/* Horizontal Scrolling Stories */}
        <div className="pb-3">
          <div className="story-container overflow-y-hidden d-flex gap-3 px-3">
            <SingleConversationCard
              post={post}
              story={post.stories}
              loggedIn={loggedIn}
              userData={userData}
            />
          </div>
        </div>
      </div>

      {/* Conversation Menu Offcanvas */}
      <Offcanvas
        show={activeOffcanvas === "main"}
        onHide={() => setActiveOffcanvas(null)}
        placement="bottom"
        className={`offcanvas-report ${
          mode == "dark" ? "bg-dark text-light" : ""
        }`}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Conversation Actions</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="item py-3" onClick={() => handleSave(post.id)}>
            <Heart size={30} className="mx-4" style={{ marginTop: "-4px" }} />
            {t("mark as favorite")}
          </div>
          <div className="item py-3">
            <RiShareForwardLine size={30} className="mx-4" />
            {t("share")}
          </div>
          <div
            className="item py-3"
            onClick={() => setActiveOffcanvas("report")}
          >
            <FaRegFlag size={30} className="mx-4" />
            {t("report")}
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Report Options Offcanvas */}
      <Offcanvas
        show={activeOffcanvas === "report"}
        onHide={() => setActiveOffcanvas(null)}
        placement="bottom"
        className={`offcanvas-report-option ${
          mode == "dark" ? "bg-dark text-light" : ""
        }`}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Report Conversation</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {reportOptions.map((option, index) => (
            <div
              key={index}
              className="item py-3"
              onClick={() => handleReportOption(option, post.id)}
            >
              <label
                htmlFor={`report${index}`}
                className="ms-2"
                style={{ fontSize: "16px" }}
              >
                {option}
              </label>
            </div>
          ))}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export const SingleConversationCard = ({ post, story, loggedIn, userData }) => {
  const navigate = useNavigate();
  const { mode, background, chatColor } = useContext(ThemeContext);
  const [activeOffcanvas, setActiveOffcanvas] = useState(null);
  const { t } = useTranslation();

  const handleSave = (targetId) => {
    if (!loggedIn) {
      navigate("/login");
    } else {
      saveAsFavorite("D", targetId, userData.user.userId);
      setActiveOffcanvas(null);
    }
  };

  const handleReportOption = (option, targetId) => {
    if (!loggedIn) {
      navigate("/login");
    } else {
      report("D", targetId, option, userData.user.userId);
      setActiveOffcanvas(null);
    }
  };

  return (
    <>
      <div className="position-relative w-100">
        <MoreVertical
          color="white"
          className="position-absolute mt-2 me-2 end-0 z-1 cursor-pointer"
          size={20}
          onClick={() => setActiveOffcanvas("main")}
        />
        <div
          className={`story-card single-story-card w-100 text-decoration-none ${
            post.background.includes("AnimBg") && "anim"
          } pattern ${post.background}`}
          onClick={() => navigate(`/live/chat/${post.id}`)}
        >
          <div className="d-flex flex-column h-100 story-card-main">
            {/* Story Header */}
            <div className="story-header"></div>

            {/* Message 1 - Send */}
            <div
              className={`chatUserProfile d-flex flex-column ${"align-items-end"}`}
            >
              <div
                className={`message-wrapper ${
                  isQuestion(story[0]?.answer)
                    ? "justify-content-start"
                    : "justify-content-end"
                } pt-5 ${isQuestion(story[0]?.answer) ? "recieve" : "send"}`}
              >
                <div
                  className={`message-box ${
                    isQuestion(story[0].answer)
                      ? "bg-white text-dark"
                      : `${post.theme}` || "ChatDefaultTheme"
                  }`}
                >
                  <div className="message-text">
                    {story[0]?.answer || "No conversation"} <br />
                    <small className="w-100 d-flex justify-content-end">
                      {story[0]?.handle}
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Message 2 - Receive */}
            <div
              className={`chatUserProfile d-flex flex-column ${"align-items-start"}`}
            >
              <div
                className={`message-wrapper ${
                  isQuestion(story[1]?.answer)
                    ? "justify-content-start"
                    : "justify-content-end"
                } pt-1 ${isQuestion(story[1]?.answer) ? "recieve" : "send"}`}
              >
                <div
                  className={`message-box ${
                    isQuestion(story[1]?.answer)
                      ? "bg-white text-dark"
                      : `${post.theme}` || "ChatDefaultTheme"
                  }`}
                >
                  <div className="message-text">
                    {story[1]?.answer || "No conversation"} <br />
                    <small className="w-100 d-flex justify-content-end">
                      {story[1]?.handle}
                    </small>
                  </div>
                  <div className="message-footer">
                    <span className="message-time"></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message 3 - Send */}
            <div
              className={`chatUserProfile d-flex flex-column ${"align-items-end"}`}
            >
              <div
                className={`message-wrapper ${
                  isQuestion(story[2]?.answer)
                    ? "justify-content-start"
                    : "justify-content-end"
                } pt-1 ${isQuestion(story[2]?.answer) ? "recieve" : "send"}`}
              >
                <div
                  className={`message-box ${
                    isQuestion(story[2]?.answer)
                      ? "bg-white text-dark"
                      : `${post.theme}` || "ChatDefaultTheme"
                  }`}
                >
                  <div className="message-text">
                    {story[2]?.answer || "No conversation"} <br />
                    <small className="w-100 d-flex justify-content-end">
                      {story[2]?.handle}
                    </small>
                  </div>
                  <div className="message-footer">
                    <span className="message-time"></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Message 4 - Receive */}
            <div
              className={`chatUserProfile d-flex flex-column ${"align-items-end"}`}
            >
              <div
                className={`message-wrapper ${
                  isQuestion(story[3]?.answer)
                    ? "justify-content-start"
                    : "justify-content-end"
                } pt-1 ${isQuestion(story[3]?.answer) ? "recieve" : "send"}`}
              >
                <div
                  className={`message-box ${
                    isQuestion(story[3]?.answer)
                      ? "bg-white text-dark"
                      : `${post.theme}` || "ChatDefaultTheme"
                  }`}
                >
                  <div className="message-text">
                    {story[3]?.answer || "No conversation"} <br />
                    <small className="w-100 d-flex justify-content-end">
                      {story[3]?.handle}
                    </small>
                  </div>
                  <div className="message-footer">
                    <span className="message-time"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Actions Offcanvas */}
        <Offcanvas
          show={activeOffcanvas === "main"}
          onHide={() => setActiveOffcanvas(null)}
          placement="bottom"
          className={`offcanvas-report ${
            mode == "dark" ? "bg-dark text-light" : ""
          }`}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Chat Actions</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="item py-3" onClick={() => handleSave(post.id)}>
              <Heart size={30} className="mx-4" style={{ marginTop: "-4px" }} />
              {t("mark as favorite")}
            </div>
            <div className="item py-3">
              <RiShareForwardLine size={30} className="mx-4" />
              {t("share")}
            </div>
            <div
              className="item py-3"
              onClick={() => setActiveOffcanvas("report")}
            >
              <FaRegFlag size={30} className="mx-4" />
              {t("report")}
            </div>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Report Options Offcanvas */}
        <Offcanvas
          show={activeOffcanvas === "report"}
          onHide={() => setActiveOffcanvas(null)}
          placement="bottom"
          className={`offcanvas-report-option ${
            mode == "dark" ? "bg-dark text-light" : ""
          }`}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Report Chat</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {reportOptions.map((option, index) => (
              <div
                key={index}
                className="item py-3"
                onClick={() => handleReportOption(option, post.id)}
              >
                <label
                  htmlFor={`report${index}`}
                  className="ms-2"
                  style={{ fontSize: "16px" }}
                >
                  {option}
                </label>
              </div>
            ))}
          </Offcanvas.Body>
        </Offcanvas>
      </div>
    </>
  );
};

export const ReplyCard = ({ postId }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <>
      <div
        className={`story-card flex flex-column align-items-center justify-content-center gradient-21`}
        onClick={() => navigate(`/reply/${postId}`)}
      >
        <div className=" story-card-main ">
          <p className="d-flex justify-content-center align-items-center text-center Answer fs-5">
            {t("post your answer")}
          </p>
        </div>
        <p className="w-100 text-center">
          <CirclePlus size={50} />
        </p>
      </div>
    </>
  );
};

export const reportOptions = [
  "Sexual content",
  "Violent or repulsive content",
  "Hateful or abusive content",
  "Harassment or bullying",
  "Harmful or dangerous acts",
  "Suicide, self-harm or eating disorders",
  "Misinformation",
  "Child abuse",
  "Promotes terrorism",
  "Spam or misleading",
  "Legal issue",
];

export const saveAsFavorite = async (targetType, targetId, userId) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/Saved`, {
      userId: userId,
      targetType: targetType,
      targetId: targetId,
      savedAs: "favorite",
    });
    myToast("Saved to Favorite");
  } catch (e) {
    console.log("Save", e);
  }
};

export const report = async (targetType, targetId, reason, userId) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/Objections`,
      {
        userId: userId,
        targetType: targetType,
        targetId: targetId,
        reason: reason,
      }
    );
   
    myToast("Report submitted!");
  } catch (e) {
    console.log("report error", e);
  }
};

const shareLoc = window.location.origin;

const handleShare = async (post) => {
  let questionText =
    detectLanguage(post.description) == "English"
      ? `
            🧠 Question of the Day
“${post.description}”

Share your thoughts here:
${shareLoc + "/" + "reply/" + post.id}

Click here to see details of this question:
${shareLoc + "/" + "question/" + post.id}

Every opinion matters — let’s think, discuss, and learn together! 🌱
#WhyWho #Think #Question #Discussion


            `
      : `

"${post.description}"

आपका जवाब क्या है? 💬
👇 नीचे क्लिक करके अपना विचार ज़रूर साझा करें:
${shareLoc + "/" + "reply/" + post.id}

👉 नीचे क्लिक करके इस प्रश्न का विवरण देखें:
🔗 ${shareLoc + "/" + "question/" + post.id}

हर जवाब मायने रखता है — आइए साथ मिलकर सोचें, समझें और सीखें! 🌱
#WhyWho #सोचो #विचार

 
            `;
  if (navigator.share) {
    try {
      await navigator.share({ text: questionText });
      console.log("Shared successfully!");
    } catch (error) {
      console.error("Sharing failed:", error);
    }
  } else {
    console.log("Sharing not supported in this browser.");
  }
};

export function detectLanguage(text) {
  // Regex for Hindi (Devanagari Unicode range)
  const hindiRegex = /[\u0900-\u097F]/;
  // Regex for English alphabets
  const englishRegex = /[A-Za-z]/;

  const hasHindi = hindiRegex.test(text);
  const hasEnglish = englishRegex.test(text);

  if (hasHindi && !hasEnglish) return "Hindi";
  if (hasEnglish && !hasHindi) return "English";
  if (hasHindi && hasEnglish) return "Mixed";
  return "Unknown";
}


export function ShareTemplate({ question, answer, postId }) {
  // const templateRef = useRef(null);
  const { t } = useTranslation();

 const contentRef = useRef(null);

  const captureAndShare = async () => {
    try {
      // Load html2canvas from CDN
      if (!window.html2canvas) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.async = true;
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Capture the HTML element as canvas
      const canvas = await window.html2canvas(contentRef.current, {
        backgroundColor: '#ffffff',
       
      });

      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        // Check if Web Share API is available
        if (navigator.share) {
          try {
            const file = new File([blob], 'WhuWho.png', { type: 'image/png' });
            await navigator.share({
              files: [file],
              title: 'Shared Content',
              text: 'Check out this content!',
            });
          } catch (err) {
            if (err.name !== 'AbortError') {
              console.error('Share failed:', err);
              downloadImage(blob);
            }
          }
        } else {
          // Fallback: download the image
          downloadImage(blob);
        }
      });
    } catch (error) {
      console.error('Error capturing content:', error);
      alert('Failed to capture content. Please try again.');
    }
  };

  const downloadImage = (blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'WhoWhy.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loc = window.location.href.split("/");
  loc.pop();
  const qr = loc.join("/");

  return (
    <>
    

       <div className="item py-3" onClick={captureAndShare}>
              <RiShareForwardLine size={30} className="mx-4" />
              {t("share")}
            </div>

      <div
        ref={contentRef}
        className={`template`}
        style={{
          position: "absolute",
          backgroundColor: "transparent",
          left: "-999999px",
          padding: 0,
          textAlign: "justify",
          border: "1px solid #ccc",
          width: "100vw",
          height: "100vh",
          fontFamily: "Arial",
        }}
      >
        <div
          className="gradient-1"
          style={{
            position: "absolute",
            textAlign: "justify",
            border: "1px solid #ccc",
            width: "100%",
            height: "100vh",
            fontFamily: "Arial",
          }}
        ></div>
        <div style={{ height: "100%" }}>
          <div className="Constent position-absolute text-white p-3">
            <div className="w-100 d-flex flex-column justify-center align-items-center my-1">
              <img src="/logo-dark.png" width={160} alt="" />
            </div>
            <h3 className="templateQuestion fw-normal fs-3">
              <span className="fw-bold">Question:</span> <br /> {question}
            </h3>
            <div className="qrcode w-100 d-flex justify-content-center pt-1">
              <QRCode
                value={`${qr + "/" + postId + "," + answer.id}`} // The URL or text to encode
                logoImage="/icons/favicon-16x16.png" // Path to your logo file
                size={100} // The size of the QR code
                logoWidth={50} // The width of the logo
                logoHeight={50} // The height of the logo
                qrStyle="dots" // Style of the QR code modules ('squares' or 'dots')
                ecLevel="H" // Error correction level. "H" (high) is best for logos.
                // Other customization props
              />
            </div>
            <h3 className="templateAnswer pt-0 mt-0 fw-normal fs-3">
              <span className="fw-bold">Answer:</span> <br /> {answer.answer}
            </h3>
            <div className="tamplateAnswerDetailParant">
              <div className="tamplateAnswerDetail">
                <p>{answer.name}</p>
                <p>{answer.handle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
