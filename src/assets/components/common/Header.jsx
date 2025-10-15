import {
  ArrowLeft,
  Bell,
  Compass,
  Languages,
  Mic,
  Minus,
  Moon,
  Plus,
  Search,
  SendHorizontal,
  Settings,
  Square,
  Sun,
  X,
} from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import React, { useContext, useEffect, useMemo, useState } from "react";
import { Container, Dropdown, Form, Offcanvas } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import SearchContext from "../../services/SearchContext";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../services/slices/postSlice";
import { delay } from "motion";
import { useTranslation } from "react-i18next";
import ThemeContext from "../../services/ThemeContext";
import { zoomLevels } from "../../../App";


const debounce = (fn, delay) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
};

const Header = ({ mode, setMode }) => {
  const {mainLanguage,setMainLanguage}=useContext(ThemeContext)
  const [language, setLanguage] = useState(
    localStorage.getItem("i18nextLng") || "en"
  );
  const navigate=useNavigate()
  const { search, setSearch, nicheId } = useContext(SearchContext);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [trySearch, setTrySearch] = useState("");
  const [startListen, setStartListen] = useState(false);
 const { t, i18n } = useTranslation();
  const { posts, loading, error } = useSelector((state) => state.post);
const {zoom,setZoom}=useContext(ThemeContext);
  const dispatch = useDispatch();
  const { transcript, browserSupportsSpeechRecognition, listening } =
    useSpeechRecognition();
  const [micPermissionGranted, setMicPermissionGranted] = useState(false);

  const handleSearch = () => {
    if (search.trim()) {
    }
  };

  useEffect(() => {
    dispatch(
      fetchPosts({
        search,
        nicheId,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    document.body.className =
      mode === "light" ? "bg-light text-dark" : "bg-dark text-light";
  }, [mode]);

  useEffect(() => {
    let newMode = localStorage.getItem("mode");
    if (newMode) {
      setMode(newMode);
    }
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setSearch(trySearch);
      navigate("/")
    }
  };

  useEffect(() => {
    setSearch(transcript);
  }, [transcript]);

  const handleBack = () => {
    console.log("Going back");
  };

  const handleLanguage = (lang) => {
    localStorage.setItem("language", lang);
    setLanguage(lang);
  };

  const handleMode = () => {
    if (mode == "dark") {
      localStorage.setItem("mode", "light");
      setMode("light");
    } else {
      localStorage.setItem("mode", "dark");
      setMode("dark");
    }
  };

 const handleIncrease = () => {
  const currentIndex = zoomLevels.findIndex((z) => z === zoom);
  if (currentIndex < zoomLevels.length - 1) {
    const newzoom=zoomLevels[currentIndex + 1]
    setZoom(newzoom);
    localStorage.setItem("zoom",newzoom);
  }
};

const handleDecrease = () => {
  const currentIndex = zoomLevels.findIndex((z) => z === zoom);
  if (currentIndex > 0) {
    const newzoom=zoomLevels[currentIndex - 1]
    setZoom(newzoom);
    localStorage.setItem("zoom",newzoom);
  }
};


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
        language: localStorage.getItem("language") || "En",
      });
      setStartListen(true);
    } catch (error) {
      console.error("Speech recognition error:", error);
      toast.error("Failed to start voice recognition: " + error.message);
    }
  };

  const stop = () => {
    try {
      SpeechRecognition.stopListening();
      setStartListen(false);
    } catch (error) {
      console.error("Error stopping speech recognition:", error);
    }
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);

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

  return (
    <>
      <nav
        className={`container-fluid p-0 d-flex justify-content-between align-item-center mainHeader ${
          mode === "light" ? "bg-light text-dark" : "bg-dark text-light"
        }`}
      >
        {isSearch ? (
          <header
            className={`youtube-header ${
              mode == "dark" ? "bg-dark text-light" : "text-dark bg-light"
            } `}
          >
            <div className="header-container d-flex align-items-center">
              {/* Back Button */}
              <button
                className="back-btn1"
                onClick={handleBack}
                title="Go back"
              >
                <ArrowLeft
                  size={24}
                  color={mode == "light" ? "black" : "white"}
                  onClick={() => {
                    setIsSearch(false);
                    stop();
                  }}
                />
              </button>

              {/* Search Container */}
              <div
                className={`search-container ${
                  mode == "dark" ? "text-light bg-dark" : "text-dark bg-light"
                }`}
              >
                <div className="search-wrapper">
                  <div className="search-input-wrapper">
                    <input
                      type="search"
                      className={`search-input ${
                        mode == "dark" ? "text-light" : "text-dark"
                      }`}
                      placeholder={t("search")}
                      value={trySearch}
                      onChange={(e) => setTrySearch(e.target.value)}
                      onKeyPress={handleKeyPress}
                      onFocus={() => setIsSearchFocused(true)}
                      onBlur={() =>
                        setTimeout(() => setIsSearchFocused(false), 200)
                      }
                    />
                    <Search size={20} className="search-icon" />
                      {trySearch.trim() !==""&& <X size={20} className="cross-icon" onClick={()=>{setTrySearch("");setSearch("")}} style={{backgroundColor:"lightgrey",borderRadius:"50%",padding:"3px",position:"absolute",right:"10px"}}/>}
                  </div>

                  {/* Search Suggestions */}
                  {isSearchFocused && (
                    <div
                      className={`search-suggestions ${
                        mode == "dark"
                          ? "text-light bg-dark "
                          : "text-dark bg-light"
                      }`}
                    >
                      {posts
                        .filter((post) =>
                          post.title
                            .toLowerCase()
                            .includes(trySearch.toLowerCase())
                        )
                        .map((post) => (
                          <button
                            className="suggestion-item"
                            onClick={() => {
                              setSearch(post.title);
                              setTrySearch(post.title);
                              setIsSearchFocused(false);
                              navigate("/")
                            }}
                          >
                            <Search size={16} className={`suggestion-icon`} />
                            <span>{post.title}</span>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Voice Search Button */}
              {isSearchFocused ? (
                <button
                  className={`mic-btn-search ${
                    mode == "dark" ? "text-white" : "text-dark"
                  }`}
                  title="Search with your voice"
                  onClick={() => {
                    setSearch(trySearch);
                    navigate("/")
                  }}
                >
                  <SendHorizontal size={20} />
                </button>
              ) : !listening ? (
                <button
                  className={`mic-btn-search ${
                    mode == "dark" ? "text-white" : "text-dark"
                  }`}
                  title="Search with your voice"
                  onClick={() => start()}
                >
                  <Mic size={20} />
                </button>
              ) : (
                <button
                  className={`mic-btn-search-active ${
                    mode == "dark" ? "text-white" : "text-dark"
                  }`}
                  title="Search with your voice"
                  onClick={() => stop()}
                >
                  <Square size={20} />
                </button>
              )}
            </div>
          </header>
        ) : (
          <>
            <Link to="/">
              <img
                className="img my-3 mx-4"
                loading="lazy"
                width={"90px"}
                src={mode == "light" ? "/logo.png" : "/logo-dark.png"}
              />
            </Link>
            <div className="pt-2 mx-3 d-flex">
              <Search
                className="mx-2 mt-2"
                size={22}
                onClick={() => setIsSearch(true)}
              />
              <div className="notification me-2" onClick={()=>navigate("/notification")}>
                <Bell className="ball mx-2 mt-2" size={22} />
                <span className="NotificationCount">2</span>
              </div>

           

              <div className="mode">
                <Settings style={{ marginTop: "5px" }} onClick={toggleShow} />
              </div>
            </div>
          </>
        )}

        <Offcanvas show={show} onHide={handleClose} className={`setting-header-offcanvas ${mode=="dark"?"bg-dark text-light":""}`} placement="bottom">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Settings</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="theme d-flex w-100 justify-content-between">
               <div className="item py-3">
              {" "}
             
              {t("theme")}
            </div>
              <Form className="d-flex align-items-center py-3">
                <label htmlFor="" className="px-2">
                  Dark
                </label>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  checked={mode == "dark"}
                  onClick={handleMode}
                  style={{fontSize:"22px"}}
                />
              </Form>
            </div>

            <div className="theme d-flex w-100 justify-content-between">
               <div className="item py-3">
              {" "}
              
              {t("language")}
            </div>
              <Dropdown  className={`py-3 ${
                          mode === "light" ? "bg-white text-dark" : "bg-dark text-white"
                        }`}>
                        <Dropdown.Toggle as="button" className="border-0 bg-transparent">
                          <span
                            className=" px-2"
                            style={{
                              width: "50px",
                              color: mode === "light" ? "black" : "white",
                            }}
                          >
                            {language=="en"?"English":"हिन्दी"}
                          </span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="position-absolute language">
                          <Dropdown.Item
                            onClick={() => {
                              setLanguage("hi");
                              setMainLanguage("hi")
                              i18n.changeLanguage('hi')
                            }}
                          >
                            हिन्दी
                          </Dropdown.Item>
                          <Dropdown.Item
                            onClick={() => {
                              setLanguage("en");
                              setMainLanguage("en")
                              i18n.changeLanguage('en')
                            }}
                          >
                            English
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
            </div>
                      <div className="mt-3 ps-1 d-flex justify-content-between">
                            <div>Zoom</div>
                            <div className="zoom d-flex gap-3">
                            <Minus size={27} className="rounded-5 p-1" style={{backgroundColor:"lightgray"}} onClick={handleDecrease}/>
                            <div className="ZoomNumber">{zoom}%</div>
                            <Plus size={27} className="rounded-5 p-1" style={{backgroundColor:"lightgray"}} onClick={handleIncrease}/>
                            </div>
                      </div>
          </Offcanvas.Body>
        </Offcanvas>
      </nav>

      <style>{`
        .youtube-header {
          background: #f8f9fa;
          height: 56px;
          width:100vw;
        }

        .header-container {
          height: 100%;
          max-width: 100%;
          margin: 0;
          padding: 0 16px;
        }

        
        .back-btn1 {
          background: none;
          border: none;
          padding: 8px;
          border-radius: 50%;
          color: #606060;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease;
          min-width: 40px;
          height: 40px;
        }

        .back-btn1:hover {
          background: #f0f0f0;
          color: #303030;
        }

        .search-container {
          flex-grow: 1;
          margin: 0 16px;
          position: relative;
         
        }

        .search-wrapper {
          position: relative;
          width: 100%;
           
        }

        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-input {
          width: 100%;
          height: 40px;
          padding: 0 16px 0 48px;
          border: 1px solid #ccc;
          border-radius: 20px;
          font-size: 16px;
          background: white;
          color: #303030;
          transition: all 0.2s ease;
          background-color:transparent;
          outline: none;
        }

        .search-input:focus {
          border-color: #4d96dfcb;
          box-shadow: 0 0 0 1px #1976d2;
        }

        .search-input::placeholder {
          color: #9aa0a6;
          font-size: 16px;
        }

        .search-icon {
          position: absolute;
          left: 16px;
          color: #9aa0a6;
          z-index: 2;
          pointer-events: none;
        }


        .search-input:focus + .search-icon {
          color: #4d96dfcb;
        }
          .show{
          z-index:1000;
          }

        .mic-btn-search {
          background: transparent;
          border: 1px solid #ccc;
          padding: 8px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          min-width: 40px;
          height: 40px;
          margin-left: 8px;
        }
        .mic-btn-search-active {
          background: white;
          border: 1px solid #ff0000ff;
          padding: 8px;
          border-radius: 50%;
          color: #ffffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          min-width: 40px;
          height: 40px;
          margin-left: 8px;
          background-color:#ff0000ff;
        }


       

       

        /* Search suggestions */
        .search-suggestions {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          border: 1px solid #e0e0e0;
          border-top: none;
          border-radius: 0 0 8px 8px;
          max-height: 300px;
          overflow-y: auto;
          z-index: 100;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          background-color:transparent;
        }

        .suggestion-item {
          padding: 12px 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: background-color 0.1s ease;
          border: none;
          width: 100%;
          text-align: left;
        }

        .suggestion-item:hover {
          background: #93939368;
        }

        .suggestion-icon {
          margin-right: 12px;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .header-container {
            padding: 0 8px;
          }
          
          .search-container {
            margin: 0 8px;
          }
          
          .search-input {
            font-size: 16px; /* Prevent zoom on iOS */
          }
        }

        @media (max-width: 480px) {
          .search-input {
            padding-left: 40px;
          }
          
          .search-icon {
            left: 12px;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
