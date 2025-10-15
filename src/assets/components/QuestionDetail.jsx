import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ThemeContext from "../services/ThemeContext";
import axios from "axios";
import { useSelector } from "react-redux";
import { Dropdown, Offcanvas, Spinner } from "react-bootstrap";
import { CirclePlus, Heart, MessageCircle, MoreVertical } from "lucide-react";
import { FaRegFlag } from "react-icons/fa6";
import { RiShareForwardLine } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { report, reportOptions, saveAsFavorite } from "./Home";

const QuestionDetail = () => {
  const [following, setFollowing] = useState(false);
  const { mode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const { qid } = useParams();
  const {
    userData,
    loggedIn,
    loading: authLoading,
    error: authError,
  } = useSelector((state) => state.user);
  const [activeOffcanvas, setActiveOffcanvas] = useState(null);
    const { t } = useTranslation();
  

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
      report("Question", targetId, option, userData.user.userId);
      setActiveOffcanvas(null);
    }
  };

  const getQuestionById = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/QA/${qid}/?Type=QA`
      );
      setPost(res.data);
    } catch (e) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getQuestionById();
  }, []);

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

  const getUserProfile = async (handle) => {
    try {
      const url = `${
        import.meta.env.VITE_API_BASE_URL
      }/Users/${encodeURIComponent(handle)}`;
      console.log("url", url);
      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      console.log(error);
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
        if (Sfollowing?.handle == post?.handle) {
          setFollowing(true);
          return;
        }
      });
    }
  }, [loggedIn, userData]);

  if (loading) {
    return (
      <div className="Loader w-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <div key={post?.id} className="post-card mb-4 bg-transparent">
        {/* Post Header */}
        <div className="d-flex align-items-center p-3 border-bottom bg-transparent">
          <div className="flex-grow-1 d-flex flex-column justify-content-center ps-3">
            <div className="d-flex align-items-center">
              <div
                className="position-relative avatar-pic"
                onClick={() => navigate(`/userprofile/${post?.handle}`)}
              >
                <img
                  src={post?.avatar}
                  onError={(e) => (e.target.src = "/profile.webp")}
                  className="avatar rounded-circle"
                />
              </div>
              <small
                className="px-2"
                onClick={() => navigate(`/userprofile/${post?.handle}`)}
              >
                {post?.handle}
              </small>

              <div
                className={`btn ${
                  mode == "light" ? "btn-outline-dark" : "btn-outline-light"
                } px-2`}
                style={{ padding: "0", fontSize: "15px" }}
                onClick={() => handleFollow(post?.handle)}
              >
                {following ? "Following" : "Follow"}
              </div>
            </div>
            <div className="post-description mb-0 d-flex justify-content-between align-items-center fw-bold pt-3">
              {post?.description}
            </div>
          </div>
          <div className="d-flex flex-column justify-content-center">
            <MoreVertical
              color={mode === "light" ? "black" : "white"}
              size={20}
              onClick={()=>setActiveOffcanvas("main")}
            />
          </div>
        </div>

        {/* Post Description */}
        <div className="px-3 py-3"></div>

        {/* Horizontal Scrolling Stories */}
        <div className="pb-3">
          <div className="story-container d-flex flex-wrap gap-3 px-3">
            {post?.stories
              ?.filter((story) => story.answer !== null)
              .map((story) => (
                <SingleCard post={post} story={story} loggedIn={loggedIn} userData={userData}/>
              ))}
            <ReplyCard postId={post?.id} />
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
                <Offcanvas.Title>Report Question</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                {reportOptions.map((option, index) => (
                  <div 
                    key={index}
                    className="item py-3" 
                    onClick={() => handleReportOption(option, post.id)}
                  >
                   <label htmlFor={`report${index}`} className="ms-2" style={{fontSize:"16px"}}>{option}</label>
                  </div>
                ))}
              </Offcanvas.Body>
            </Offcanvas>
    </>
  );
};

export default QuestionDetail;

export const SingleCard = ({ post, story, loggedIn,userData }) => {
  const navigate = useNavigate();
  const { mode } = useContext(ThemeContext);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
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
      report("Question", targetId, option, userData.user.userId);
      setActiveOffcanvas(null);
    }
  };

  return (
    <div className="position-relative story-container-ques">
      <div className="position-absolute end-0 z-1">
          <MoreVertical color="white" size={20} onClick={()=>setActiveOffcanvas("main")} className="mt-1 me-1" />
      </div>
      <div
        key={story.id}
        className={`story-card-ques ${story.gradient} text-decoration-none`}
        onClick={() => navigate(`/detail/${[post?.id, story?.id].join(",")}`)}
      >
        <div className="d-flex flex-column h-100 story-card-main">
          {/* Story Header */}
          <div className="story-header"></div>

          <p className="text-justify Answer">{story?.answer}</p>

          {/* Story Footer - Only Views */}
          <div className="story-footer">
            <div className="d-flex align-items-center">
              <small className="text-light w-100 text-center">
                {story?.handle}
              </small>
            </div>
            <div className="d-flex justify-content-between px-3">
              <div className="story-views">
                <Heart size={16} className="me-2" />
                {story?.likes}
              </div>
              <div className="story-views">
                <MessageCircle size={16} className="me-2" />
                {story?.comments}
              </div>
            </div>
          </div>
        </div>
      </div>
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
                <Offcanvas.Title>Report Question</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                {reportOptions.map((option, index) => (
                  <div 
                    key={index}
                    className="item py-3" 
                    onClick={() => handleReportOption(option, post.id)}
                  >
                   <label htmlFor={`report${index}`} className="ms-2" style={{fontSize:"16px"}}>{option}</label>
                  </div>
                ))}
              </Offcanvas.Body>
            </Offcanvas>
    </div>
  );
};

const ReplyCard = ({ postId }) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className={`reply-card-ques flex flex-column align-items-center justify-content-center gradient-21`}
        onClick={() => navigate(`/reply/${postId}`)}
      >
        <div className=" story-card-main ">
          <p className="d-flex justify-content-center align-items-center text-center Answer fs-5">
            Post Your Answer
          </p>
        </div>
        <p className="w-100 text-center">
          <CirclePlus size={50} />
        </p>
      </div>
    </>
  );
};
