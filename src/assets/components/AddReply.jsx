import React, { useContext, useEffect, useState } from "react";
import "../style/post.css";
import { Ban, Languages, MoreVertical, X } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import Dropdown from "react-bootstrap/Dropdown";
import { addAnswer, addStory, fetchPosts } from "../services/slices/postSlice";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import ThemeContext from "../services/ThemeContext";
import Footer from "./common/Footer";
import { login } from "../services/slices/userSlice";
import googleTransliterate from "google-input-tool";

const gradientClasses = [
  "gradient-1",
  "gradient-2",
  "gradient-3",
  "gradient-4",
  "gradient-5",
  "gradient-6",
  "gradient-7",
  "gradient-8",
  "gradient-9",
  "gradient-10",
  "gradient-11",
  "gradient-12",
  "gradient-13",
  "gradient-14",
  "gradient-15",
  "gradient-16",
  "gradient-17",
  "gradient-18",
  "gradient-19",
  "gradient-20",
];

const AddReply = () => {
  const navigate = useNavigate();
  const [isPosting, setIsPosting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeMode, setActiveMode] = useState("text");
  const [language, setLanguage] = useState(
    localStorage.getItem("langauge") || "hi-t-i0-und"
  );
  const { mode } = useContext(ThemeContext);
  const { posts, loading, error } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const [grad, setGrad] = useState(null);
  const { id } = useParams();
  const { userData, loggedIn } = useSelector((state) => state.user);

  const index = posts.findIndex((post) => post.id == id);

  const [postData, setPostData] = useState({
    questionId: id,
    answerText: "",
    description: "",
    language: language,
    background: "",
    music: "",
  });

  const handleTransliterate = () => {
    const request = new XMLHttpRequest();
    const inputLanguage = language;
    const maxResult = 2;

    googleTransliterate(request, postData.answerText, inputLanguage, maxResult)
      .then((response) => {
        // Response is an array. For single result:
        setPostData((pre) => ({
          ...pre,
          description: response[0][0] + " ",
          answerText: response[0][0] + " ",
        }));
      })
      .catch((err) => {
        toast.error("Error: " + err);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData((pre) => ({
      ...pre,
      [name]: value,
    }));
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
    setPostData((pre) => ({
      ...pre,
      background: grad,
    }));
  }, [grad]);
  const handlePost = () => {
    if (!postData.answerText.trim()) return;

    if (loggedIn) {
      dispatch(
        addAnswer({
          id: userData.user.userId,
          data: postData,
        })
      );
      setTimeout(() => {
        setIsPosting(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }, 1000);
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    if (showSuccess) {
      toast.success("Answer Post successfully created");
      navigate("/");
    }
  }, [showSuccess]);

  const handleReset = () => {
    setPostData((pre) => ({
      ...pre,
      answerText: "",
    }));
    setGrad(null);
  };

  useEffect(() => {
    if (posts.length <= 0) {
      dispatch(fetchPosts());
    }
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="Loader w-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" />
      </div>
    );
  }

  const getTextSizeClass = (text) => {
    const length = text.length;
    if (length <= 50) return "short-text";
    if (length <= 100) return "medium-text";
    if (length <= 200) return "long-text";
    return "very-long-text";
  };

  const handleLanguage = (lang) => {
    localStorage.setItem("language", lang);
    setLanguage(lang);
  };

  return (
    <>
      <div className={`${grad}`}>
        <div className={`post-creator bg-transparent`}>
          {/* Header */}
          <div className="header border-0 bg-transparent">
            <div className="profile-section bg-transparent">
              <button className="close-btn" onClick={() => navigate(-1)}>
                <X color={mode == "light" ? "black" : "white"} size={30} />
              </button>
            </div>

            <div className="action-buttons">
              <Dropdown style={{ paddingTop: "0px", width: "80px" }}>
                <Dropdown.Toggle
                  as="button"
                  className="border-0 bg-transparent"
                >
                  <span
                    className="fs-5 px-2"
                    style={{
                      width: "50px",
                      color: mode === "light" ? "black" : "white",
                    }}
                  >
                    {language == "hi-t-i0-und" ? "हिन्दी" : "English"}
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="position-absolute language">
                  <Dropdown.Item
                    onClick={() => {
                      handleLanguage("hi-t-i0-und");
                    }}
                  >
                    हिन्दी
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      handleLanguage("");
                    }}
                  >
                    English
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <button className="btn-reset" onClick={handleReset}>
                Reset
              </button>
              <button
                className="btn-post"
                onClick={handlePost}
                disabled={!postData.answerText.trim() || isPosting}
              >
                {isPosting ? "Posting" : "Post"}
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className={`content-area ${grad}`}>
            <div className="container-fluid d-flex justify-content-end my-1"></div>
            <div className="container-fluid">
              <p className="fs-2 text-center">{posts[index]?.description}</p>
            </div>
            <textarea
              className={`bg-transparent border-0 form-control ${
                mode == "dark" ? "text-light" : ""
              } ${getTextSizeClass(postData.answerText)}`}
              placeholder="Type your Answer..."
              value={postData.answerText}
              name="answerText"
              onKeyDown={(e) => {
                (e.key == " " ||
                  e.key == "" ||
                  e.key == "Enter" ||
                  e.code === "Space" ||
                  e.key == "Spacebar") &&
                  handleTransliterate();
              }}
              onChange={(e) => handleChange(e)}
              maxLength={150}
            />
          </div>

          <div className="gradientMainBox">
            <div
              className="colorBox border border-dark d-flex align-items-center justify-content-center"
              onClick={(e) => setGrad(null)}
            >
              <Ban />{" "}
            </div>
            {gradientClasses.map((grad) => (
              <div
                className={`colorBox ${grad}`}
                onClick={(e) => setGrad(grad)}
              ></div>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="bottom-section">
            <div className="media-options">
              <div
                className={`slider 
        ${activeMode === "text" ? "text-active" : ""} 
        ${activeMode === "mic" ? "mic-active" : ""} 
        ${activeMode === "music" ? "music-active" : ""}`}
              ></div>

              <div className="media-toggle">
                <button
                  className={`media-btn ${
                    activeMode === "text" ? "active" : ""
                  }`}
                  onClick={() => setActiveMode("text")}
                >
                  Text
                </button>
                <button
                  className={`media-btn ${
                    activeMode === "mic" ? "active" : ""
                  }`}
                  // onClick={() => setActiveMode("mic")}
                >
                  Voice
                </button>
              </div>
            </div>

            <div
              className={`char-count ${
                postData.answerText.length > 125
                  ? "danger"
                  : postData.answerText.length > 100
                  ? "warning"
                  : ""
              }`}
            >
              {postData.answerText.length}/150
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddReply;
