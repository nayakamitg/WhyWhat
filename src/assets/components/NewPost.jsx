// Add this improved error handling and permission checks

import React, { useContext, useEffect, useState } from "react";
import "../style/post.css";
import { X } from "lucide-react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import Dropdown from "react-bootstrap/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../services/slices/postSlice.jsx";
import ThemeContext from "../services/ThemeContext.js";
import { Spinner } from "react-bootstrap";
import { getCategories } from "../services/slices/otherSlice.jsx";
import PostContext from "../services/PostContext.js";
import { setUserFromStorage } from "../services/slices/userSlice.jsx";
import { useTranslation } from "react-i18next";
import googleTransliterate from "google-input-tool";

import Footer from "./common/Footer.jsx";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

const NewPost = () => {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState("text");
  const { loading, isPosting } = useSelector((state) => state.post);
  const dispatch = useDispatch();
   const { t } = useTranslation();
  const [startListen, setStartListen] = useState(false);
  const otherdispatch = useDispatch();
  const { mode } = useContext(ThemeContext);
  const { categories } = useSelector((state) => state.other);
  const [tagged, setTagged] = useState([
    "@amit",
    "@sohan",
    "@rohan",
    "@adam",
    "@ram",
  ]);

  const {
    transcript,
    finalTranscript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    listening,
  } = useSpeechRecognition();

 
  const { setPostPreData, postPreData } = useContext(PostContext);
  const [searchInput, setSearchInput] = useState("");
  const [tag, setTag] = useState();
  const [postData, setPostData] = useState({
    questionText: postPreData.questionText || "",
    description: postPreData.questionText || "",
    nicheId: 1,
    askTo: postPreData.askTo || 0,
    language: postPreData.language || "",
  });

  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem("langauge") || "hi-t-i0-und");
  const [micPermissionGranted, setMicPermissionGranted] = useState(false);

  const { userData, loggedIn } = useSelector((state) => state.user);

  // Check for secure context and browser support
  useEffect(() => {
    // Check if running in secure context
    if (!window.isSecureContext) {
      console.error("Speech recognition requires HTTPS");
    }

    // Check browser support
    if (!browserSupportsSpeechRecognition) {
      console.error("Browser doesn't support speech recognition");
    }

    // Log for debugging
    console.log("Secure context:", window.isSecureContext);
    console.log("Browser supports speech:", browserSupportsSpeechRecognition);
  }, [browserSupportsSpeechRecognition]);

  // Check microphone permissions
  const checkMicrophonePermission = async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Stop all tracks immediately - we just needed to check permission
      stream.getTracks().forEach((track) => track.stop());

      setMicPermissionGranted(true);
      return true;
    } catch (error) {
      console.error("Microphone permission error:", error);

      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        toast.error(
          "Microphone access denied. Please allow microphone access in your browser settings."
        );
      } else if (error.name === "NotFoundError") {
        toast.error("No microphone found. Please connect a microphone.");
      } else {
        toast.error("Could not access microphone: " + error.message);
      }

      return false;
    }
  };


   const handleTransliterate = () => {
      const request = new XMLHttpRequest();
      const inputLanguage = selectedLanguage;
      const maxResult = 2;
  
      googleTransliterate(request, postData.description ||postData.questionText, inputLanguage, maxResult)
        .then((response) => {
          // Response is an array. For single result:
          setPostData((pre) => ({
            ...pre,
            description: response[0][0] + " ",
            questionText: response[0][0] + " ",
          }));
        })
        .catch((err) => {
          toast.error("Error: " + err);
        });
    };

  useEffect(() => {
    if (!loggedIn) {
      const uData = JSON.parse(localStorage.getItem("userData"));
      if (uData) {
        dispatch(setUserFromStorage(uData));
      }
    }
  }, [dispatch, loggedIn]);

  const handleLanguageChange = async (lang) => {
    setSelectedLanguage(lang);
  };

  useEffect(() => {
    otherdispatch(getCategories());
  }, [otherdispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "questionText") {
      setPostData((pre) => ({
        ...pre,
        description: value,
      }));
    }
    setPostData((pre) => ({
      ...pre,
      [name]: value,
    }));
  };

  const handlePost = () => {
    if (loggedIn) {
      if (!postData.questionText.trim()) {
        toast.error("Question text cannot be empty");
        return;
      }

      const formattedData = {
        questionText: postData.questionText.trim(),
        description: postData.description.trim(),
        nicheId: parseInt(postData.nicheId),
        askTo: parseInt(postData.askTo) || 0,
        language: postData.language || "English",
      };

      dispatch(
        addPost({
          id: userData?.user?.userId,
          data: formattedData,
        })
      );
      setPostPreData({
        questionText: "",
        description: "",
        nicheId: 1,
        askTo: 0,
        language: "",
      });
      setPostData({
        questionText: "",
        description: "",
        nicheId: 1,
        askTo: 0,
        language: "",
      });
      navigate("/");
    } else {
      setPostPreData(postData);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (finalTranscript) {
      setPostData((prev) => ({
        ...prev,
        description: prev.description + " " + finalTranscript,
        questionText: prev.questionText + " " + finalTranscript,
      }));
      resetTranscript();
    }
  }, [finalTranscript, resetTranscript]);

  const handleReset = () => {
    setTag("");
    setPostData((pre) => ({
      ...pre,
      questionText: "",
      nicheId: 1,
    }));
    resetTranscript();
  };

  const handleTagSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const getTextSizeClass = (text) => {
    const length = text.length;
    if (length <= 50) return "short-text";
    if (length <= 100) return "medium-text";
    if (length <= 200) return "long-text";
    return "very-long-text";
  };

  // Improved start function with error handling
  const start = async () => {
    // Check if browser supports speech recognition
    if (!browserSupportsSpeechRecognition) {
      console.error("Your browser doesn't support speech recognition");
      return;
    }

    // Check secure context
    if (!window.isSecureContext) {
      console.error("Voice input requires HTTPS connection");
      return;
    }

    // Check and request microphone permission
    const hasPermission = await checkMicrophonePermission();
    if (!hasPermission) {
      return;
    }

    try {
      // Start listening with error handling
      SpeechRecognition.startListening({
        continuous: true,
        language: selectedLanguage,
      });
      setStartListen(true);
      toast.success("Voice recognition started");
    } catch (error) {
      console.error("Speech recognition error:", error);
      toast.error("Failed to start voice recognition: " + error.message);
    }
  };

  const stop = () => {
    try {
      SpeechRecognition.stopListening();
      setStartListen(false);
      toast.success("Voice recognition stopped");
    } catch (error) {
      console.error("Error stopping speech recognition:", error);
    }
  };

  // Add error listener for speech recognition
  useEffect(() => {
    const handleSpeechError = (event) => {
      console.error("Speech recognition error:", event);
      toast.error(
        "Speech recognition error: " + (event.error || "Unknown error")
      );
      setStartListen(false);
    };

    if (typeof window !== "undefined" && window.SpeechRecognition) {
      window.addEventListener("speechrecognitionerror", handleSpeechError);
      return () => {
        window.removeEventListener("speechrecognitionerror", handleSpeechError);
      };
    }
  }, []);

  if (loading) {
    return (
      <div className="Loader w-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <div
        className={`post-creator ${
          mode === "light" ? "bg-light text-dark" : "bg-dark text-light"
        }`}
      >
        {/* Header */}
        <div
          className={`header ${
            mode === "light" ? "bg-light text-dark" : "bg-dark text-light"
          }`}
        >
          <div className="profile-section postProfileSection">
            <button className="close-btn" onClick={() => navigate(-1)}>
              <X color={mode === "light" ? "black" : "white"} size={30} />
            </button>
          </div>

          <div className="action-buttons">
            <button className="btn btn-dark py-1 rounded-4 me-2" onClick={handleReset}>
              {t("reset")}
            </button>
            <button
              className="btn btn-dark  py-1 rounded-4 me-2"
              onClick={handlePost}
              disabled={!postData.questionText.trim() || isPosting}
            >
              {isPosting ?`${t("posting")}` : `${t("post")}`}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* <div className="d-flex">
            <select
              name="nicheId"
              value={postData.nicheId}
              className={`CatergorySelector form-select my-2 ${
                mode === "light" ? "bg-white text-dark" : "bg-dark text-white"
              }`}
              onChange={(e) =>
                setPostData((pre) => ({ ...pre, nicheId: e.target.value }))
              }
            >
              <option disabled value={0}>
                Select Category
              </option>
              {categories.map((cat) => (
                <option key={cat.nicheId} value={cat.nicheId}>
                  {cat?.title}
                </option>
              ))}
            </select>
            <Dropdown className="border m-2 p-1 rounded">
              <Dropdown.Toggle
                as="button"
                className={`border-0 ${
                  mode === "light" ? "bg-white text-dark" : "bg-dark text-white"
                }`}
              >
                {tag || "Ask to"}
              </Dropdown.Toggle>

              <Dropdown.Menu
                className={`position-absolute border language ${
                  mode === "light" ? "bg-white text-dark" : "bg-dark text-white"
                }`}
              >
                <input
                  type="text"
                  className={`border px-2 mx-2 ${
                    mode === "light"
                      ? "bg-white text-dark"
                      : "bg-dark text-white"
                  }`}
                  onChange={(e) => handleTagSearch(e)}
                  placeholder="Search"
                />

                {(searchInput === "" ||
                  "Public".toLowerCase().includes(searchInput.toLowerCase())) && (
                  <Dropdown.Item
                    className={`border-bottom ${
                      mode === "light"
                        ? "bg-white text-dark"
                        : "bg-dark text-white"
                    }`}
                    onClick={() => setTag("Public")}
                  >
                    Public
                  </Dropdown.Item>
                )}

                {tagged
                  .filter((tag) =>
                    tag
                      .replace("@", "")
                      .toLowerCase()
                      .startsWith(searchInput.toLowerCase())
                  )
                  .map((tag, index) => (
                    <Dropdown.Item
                      key={index}
                      className={`border-bottom ${
                        mode === "light"
                          ? "bg-white text-dark"
                          : "bg-dark text-white"
                      }`}
                      onClick={() => setTag(tag)}
                    >
                      {tag}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
          </div> */}
          <textarea
            className={`form-control myform-control ${getTextSizeClass(
              postData.questionText
            )} ${mode === "light" ? "" : "bg-dark text-white"}`}
            placeholder={t("type your question")}
            value={postData.questionText}
            name="questionText"
            onChange={(e) => handleChange(e)}
            maxLength={150}
            disabled={isTranslating}
            onKeyDown={(e) => {if(activeMode!=="mic")
                if(e.key == " " ||
                  e.key == "" ||
                  e.key == "Enter" ||
                  e.code === "Space" ||
                  e.key == "Spacebar"){
                  handleTransliterate();}
              }}
          />
          {activeMode === "mic" && (
            <div className="w-100 d-flex justify-content-center">
              {!listening ? (
                <div className="mic-btn" onClick={start}>
                  Start
                </div>
              ) : (
                <div className="mic-btn-active" onClick={stop}>
                  Stop
                </div>
              )}
            </div>
          )}

          <Dropdown  className={`text-language position-absolute language ${
              mode === "light" ? "bg-white text-dark" : "bg-dark text-white"
            }`}>
            <Dropdown.Toggle as="button" className="border-0 bg-transparent">
              <span
                className="fs-5 px-2"
                style={{
                  width: "50px",
                  color: mode === "light" ? "black" : "white",
                }}
              >
                {selectedLanguage==("en-IN" || "")?"English":"हिन्दी"}
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="position-absolute language">
              <Dropdown.Item
                onClick={() => {
                  setSelectedLanguage("hi-t-i0-und");
                }}
              >
                हिन्दी
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setSelectedLanguage("");
                }}
              >
                English
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          {/* <select
            onChange={(e) => handleLanguageChange(e.target.value)}
            value={selectedLanguage}
            className={`border text-language position-absolute language ${
              mode === "light" ? "bg-white text-dark" : "bg-dark text-white"
            }`}
            disabled={isTranslating}
          >
            <option value="en-IN">English</option>
            <option value="hi-IN">हिन्दी</option>
          </select> */}
          {isTranslating && (
            <div
              className="position-absolute"
              style={{ top: "10px", right: "10px" }}
            >
              <Spinner animation="border" size="sm" />
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="bottom-section">
          <div className="media-options">
            <div
              className={`slider ${activeMode === "mic" ? "mic-active" : ""}`}
            ></div>
            <div className="media-toggle">
              <button
                className={`media-btn ${activeMode === "text" ? "active" : ""}`}
                onClick={() => setActiveMode("text")}
              >
                {t("text")}
              </button>
              <button
                className={`media-btn ${activeMode === "mic" ? "active" : ""}`}
                // onClick={() => setActiveMode("mic")}
              >
                {t("voice")}
              </button>
            </div>
          </div>

          <div
            className={`char-count ${
              postData.questionText.length > 125
                ? "danger"
                : postData.questionText.length > 100
                ? "warning"
                : ""
            }`}
          >
            {postData.questionText.length}/150
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default NewPost;
