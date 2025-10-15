import React, { useContext, useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../index.css";

import {
  ArrowLeft,
  Ban,
  Bell,
  EllipsisVertical,
  Heart,
  MessageCirclePlus,
  Mic,
  MoreVertical,
  Send,
  SendHorizontal,
  Settings,
  X,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Dropdown, Spinner, Tab, Tabs } from "react-bootstrap";
import ThemeContext from "../services/ThemeContext";
import Offcanvas from "react-bootstrap/Offcanvas";
import SidebarContext from "../services/SidebarContext";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../services/slices/postSlice";
import { login } from "../services/slices/userSlice";

export default function WhatsAppChat() {
  const {
    posts,
    loading: postsLoading,
    error,
  } = useSelector((state) => state.post);

  const { showSidebar } = useContext(SidebarContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const [sendShow, setSendShow] = useState(false);
  const [searchShow, setSearchShow] = useState(false);
  const containerRef = useRef();
  const { id } = useParams();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const { mode, chatColor, setChatColor, background, setBackground } =
    useContext(ThemeContext);
  const [singleConversation, setSingleConversation] = useState(null);
  const [key, setKey] = useState("Gradient");

  const [posting, setPosting] = useState(false);

  const formatText = (text) => {
    return text
      ?.split("*")
      .map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
  };

  const [tagged, setTagged] = useState([
    "@amit",
    "@sohan",
    "@rohan",
    "@adam",
    "@ram",
  ]);

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

  const getConversationById = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/QA/${id}/?Type=CD`
      );
      setSingleConversation(res.data);
    } catch (e) {
      console.error(e);
      toast.error(e);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getConversationById(id);
  }, [id]);

  useEffect(() => {
    dispatch(
      fetchPosts({
        search: searchInput,
        nicheId: null,
      })
    );
  }, []);

  const handleChange = (e) => {
    setMessageInput(e.target.value);
  };

  const handleTagSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchShow = () => {};

  const createChat = async () => {
    try {
      setPosting(true);
      const data = {
        dialogueCode: `D${Math.floor(100 + Math.random() * 900)}`,
        userId: userData.user.userId,
        conversationId: singleConversation?.id,
        dialogueText: messageInput,
        description: "",
        language: "endlish",
      };
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/Dialogues`,
        data
      );
      setSingleConversation((prev) => ({
        ...prev,
        stories: [
          ...(prev.stories || []),
          {
            answer: messageInput,
            handle: userData.user.handle,
          },
        ],
      }));

      setTimeout(() => {
        const container = containerRef.current;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, 0);
      setMessageInput("");
    } catch (e) {
      console.log("Not added", e);
    } finally {
      setPosting(false);
    }
  };

  useEffect(() => {
    setSendShow(messageInput.trim().length > 0);
  }, [messageInput]);

  const handleSend = () => {
    if (!messageInput.trim()) return; // prevent empty messages

    if (!loggedIn) {
      navigate("/login");
    } else {
      createChat();
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  if (postsLoading || loading) {
    return (
      <div className="Loader w-100 d-flex justify-content-center align-items-center">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div>
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
          // position:relative;
          overflow-y:hidden;
        }
         
       
        .offcanvas.show{
        border-radius:20px 20px 0 0
        width:50%
        }

        .chat-header {
          background-color: #ffffffff;
          padding: 10px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 1px 2px rgba(0,0,0,0.3);
          position:absolute;
          z-index:20;
          width:100%;
    
        }
        
        .header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          width:100%;
        }
        
        .back-arrow {
          color: #000000ff;
          cursor: pointer;
          font-size: 24px;
        }
        
        .avatar {
          width: 40px;
          aspect-ratio:1/1;
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
        .avatar-card {
          width: 25px;
          aspect-ratio:1/1;
          height: 25px;
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
          font-size: 12px;
        }
        
        .header-icons {
          display: flex;
          gap: 24px;
          color: #000000ff;
        }
        
      
        
        .chat-body {
        margin:60px 0 100px 0;
        width:100% !important;
          flex: 1;
          overflow-y: auto;
          padding: 20px 8px;
          background-color:${background == "#f1f1f1" ? "#f1f1f1" : ""};
                      
           animation: ${
             background.toLowerCase().includes("animbg") &&
             "pulse-light 3s infinite alternate ,move-background 20s linear infinite"
           }
           
        }
           .anim{
            animation: pulse-light 3s infinite alternate ,move-background 20s linear infinite
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
        
         .message-box-time {
          width: 150px;
          padding: 8px 10px;
          border-radius: 8px;
          position: relative;
          word-wrap: normal;
          overflow:hidden;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.24);
          background-color:"white"
        }

        .message-box-description {
          width:100%;
          padding: 8px 10px;
          border-radius: 8px;
          position: relative;
          word-wrap: break-word;
          overflow:hidden;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.24);
          background-color:white;
          text-align:center;
          font-weight:550;
          color:black;
        }
.message-box-description .message-text {
font-size:16px;
}
        

        .message-box {
          max-width: 75%;
          min-width:250px;
          padding: 8px 10px;
          border-radius: 8px;
          position: relative;
          word-wrap: break-word;
          overflow:hidden;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.24);
          
        }
        

       

        .message-box.sent {
          border-bottom-right-radius: 2px;
          backdrop-filter:blur(10px)
        }
        .message-box.received {
          background-color: #ffffffff;
          color: #000000ff;
          border-bottom-left-radius: 2px;
        }
        .message-box-time.received {
          background-color: #ffffffff;
          border-bottom-left-radius: 2px;
        }
        
        .message-text {
          font-size: 14px;
          line-height: 19px;
          white-space: pre-wrap;
        }
        
        .message-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 4px;
          margin-top: 4px;
          height: 15px;
        }
        
        .message-time {
          font-size: 11px;
          color: black;
          padding:0;
        }
        
        .check-marks {
          width: 16px;
          height: 16px;
          color: #00b3ffff;
        }
        
        .chat-footer {
          background-color: #ffffffff;
          padding: 8px 16px;
          position:absolute;
          border-bottom:none;
          bottom:50px;
          width:100%;
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
          border:1px solid lightgrey;
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
          padding: 0 8px;
        }
        
        .input-container input::placeholder {
          color: #8696a0;
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
          aspect-ratio: 1/1;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
          
.notificationWhatsApp {
  position: relative;

}
  .bgparent{
padding-top:10px;
width:100%;
overflow-x:auto;
  }
  .box{
  min-width:80px;
  height:110px;
  border-radius:10px;
  user-select:none;
  }
  .box img{
  width:100%;
  height:100%;
  object-fit:cover;
  border-radius:10px;
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
  left:10px;
}

  .chat-body[class*="AnimBg"] {
            background-image: var(--pattern-image);
            background-size: var(--pattern-size);
            /* Resetting default background-position so the animation takes full control */
            background-position: 0 0; 
        }
  .anim[class*="AnimBg"] {
            background-image: var(--pattern-image);
            background-size: var(--pattern-size);
            /* Resetting default background-position so the animation takes full control */
            background-position: 0 0; 
        }

         .pattern[class*="PaternBg"] {
            background-image: var(--pattern-image);
            background-size: var(--pattern-size);
        }
        
        .mic-button svg {
          width: 24px;
          height: 24px;
          color: #ffffffff;
        }
      `}</style>

      <div className="chat-container">
        {/* Header */}
        <div className="chat-header">
          <div className="header-left">
            <span className="back-arrow" onClick={() => navigate("/live")}>
              <ArrowLeft />
            </span>
            <div className="avatar">
              <img
                src={singleConversation?.avatar || "/profile.webp"}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                onError={(e) => (e.target.src = "/profile.webp")}
                alt=""
              />
            </div>
            <div
              className="contact-info w-100"
              // onClick={() => setSearchShow(true)}
              onClick={() => navigate("/live")}
            >
              <h6>{singleConversation?.title}</h6>
              <small>{singleConversation?.handle}</small>
            </div>
          </div>
          <div className="header-icons">
            {/* <Dropdown>
              <Dropdown.Toggle
                as="button"
                className="border-0 bg-transparent p-0 m-0"
              >
                <MessageCirclePlus
                  color="black"
                  size={24}
                  style={{ marginTop: "-5px" }}
                />
              </Dropdown.Toggle>
              <Dropdown.Menu className={`position-absolute border language`}>
                <input
                  type="text"
                  className={`border px-2 mx-2 bg-light text-dark`}
                  onChange={(e) => handleTagSearch(e)}
                  placeholder="Search"
                />

                {(searchInput === "" ||
                  "Public"
                    .toLowerCase()
                    .includes(searchInput.toLowerCase())) && (
                  <Dropdown.Item
                    className={`border-bottom`}
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
                      className={`border-bottom d-flex justify-content-between align-item-center`}
                      onClick={() => setTag(tag)}
                    >
                      <p className="p-0 m-0">{tag}</p>
                      <span className="text-primary">+Invite</span>
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown> */}

            {/* <Dropdown>
              <Dropdown.Toggle
                as="button"
                className="border-0 bg-transparent p-0 m-0"
              >
                <div className="notificationWhatsApp">
                  <Bell className="ball" size={24} color="black" />
                  <span className="NotificationCountWhatsApp position-absolute">
                    2
                  </span>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className={`position-absolute border language`}>
                <input
                  type="text"
                  className={`border px-2 mx-2 bg-light text-dark`}
                  onChange={(e) => handleTagSearch(e)}
                  placeholder="Search"
                />

                {(searchInput === "" ||
                  "Public"
                    .toLowerCase()
                    .includes(searchInput.toLowerCase())) && (
                  <Dropdown.Item
                    className={`border-bottom`}
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
                      className={`border-bottom d-flex justify-content-between align-item-center`}
                      onClick={() => setTag(tag)}
                    >
                      <p className="p-0 m-0">{tag}</p>
                      <span className="text-primary">+Accept</span>
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown> */}

            <Settings
              color="black"
              size={24}
              style={{ marginTop: "-5px" }}
              onClick={handleShow}
            />
          </div>
        </div>

        {/* Chat Body */}
        {loading ? (
          <div className="Loader w-100 d-flex justify-content-center align-items-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <div
            className={`chat-body ${
              background == ""
                ? `${
                    singleConversation?.background?.includes("Anim")
                      ? `anim`
                      : `pattern`
                  }`
                : background.includes("Anim")
                ? "anim"
                : "pattern"
            } ${background ? background : singleConversation?.background}`}
            ref={containerRef}
          >
            {searchShow && (
              <div
                className="backdrop"
                onClick={() => setSearchShow(false)}
              ></div>
            )}
            {searchShow && (
              <div className="chatSearchContainer">
                <div className="input-container m-2 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-search"
                    aria-hidden="true"
                  >
                    <path d="m21 21-4.34-4.34"></path>
                    <circle cx="11" cy="11" r="8"></circle>
                  </svg>
                  <input
                    placeholder="Search conversations..."
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {search.trim() !== "" && (
                    <X
                      size={20}
                      onClick={() => setSearch("")}
                      style={{
                        backgroundColor: "lightgrey",
                        borderRadius: "50%",
                        padding: "3px",
                      }}
                    />
                  )}
                </div>

                <div className="suggetionContainer">
                  {posts
                    ?.filter(
                      (chat) =>
                        chat.type == "CD" &&
                        chat.title.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((msg) => (
                      <div
                        key={msg.id}
                        className="border d-flex align-items-center justify-content-between cursor-pointer"
                        onClick={() => {
                          setSearchShow(false);
                          navigate(`/live/chat/${msg?.id}`);
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
                            <span className="">{msg.title}</span>
                            <p className="p-0 m-0 text-dark">{msg.handle}</p>
                          </div>
                        </div>
                        <small className="join text-center p-3">
                          01/01/2025
                        </small>
                      </div>
                    ))}
                </div>
              </div>
            )}
            <div
              className={`chatUserProfile d-flex flex-column ${"align-items-center"}`}
            >
              {" "}
              {/* <div
                className={`User-info d-flex align-items-center gap-1 ${
                  msg.sender == "me" ? "flex-row-reverse" : ""
                }`}
              >
                <div className="avatar">A</div>
                <p className="text-white pt-3 pb-0 fs-6">
                  {msg.sender == "me" ? "You" : "User"}
                </p>
              </div> */}
              <div
                className={`message-wrapper w-100 px-2 justify-content-center ${"received"}`}
              >
                <div
                  className={`message-box-description w-100 rounded-2 ${"received"}`}
                >
                  <div className="message-text">
                    {singleConversation?.description}
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`chatUserProfile mb-3 d-flex flex-column ${"align-items-center"}`}
            >
              {" "}
              {/* <div
                className={`User-info d-flex align-items-center gap-1 ${
                  msg.sender == "me" ? "flex-row-reverse" : ""
                }`}
              >
                <div className="avatar">A</div>
                <p className="text-white pt-3 pb-0 fs-6">
                  {msg.sender == "me" ? "You" : "User"}
                </p>
              </div> */}
              <div
                className={`message-wrapper-time m-0 p-0 ${"received"} justify-content-center`}
              >
                <div
                  className={`message-box-time rounded-2 m-0 p-1 px-2 ${"received"}`}
                >
                  <div
                    className="text-center"
                    style={{ fontSize: "12px", color: "grey" }}
                  >
                    {new Date(singleConversation?.questionDate).toLocaleString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>

            {singleConversation?.stories
              ?.filter((msg) => msg.answer !== null && msg.answer !== "")
              .map((msg, index) => (
                <div
                  className={`chatUserProfile d-flex flex-column ${
                    !isQuestion(msg?.answer)
                      ? "align-items-end"
                      : "align-items-start"
                  }`}
                >
                  {" "}
                  {/* <div
                className={`User-info d-flex align-items-center gap-1 ${
                  msg.sender == "me" ? "flex-row-reverse" : ""
                }`}
              >
                <div className="avatar">A</div>
                <p className="text-white pt-3 pb-0 fs-6">
                  {msg.sender == "me" ? "You" : "User"}
                </p>
              </div> */}
                  <div
                    key={msg.id}
                    className={`message-wrapper ${
                      !isQuestion(msg?.answer) ? "sent" : "received"
                    }`}
                  >
                    <div
                      className={`message-box ${
                        !isQuestion(msg?.answer)
                          ? `sent ${
                              chatColor != ""
                                ? chatColor
                                : singleConversation.theme
                            }`
                          : "received"
                      }`}
                    >
                      <div className="message-text">
                        {formatText(msg?.answer)}
                      </div>
                      <div className="message-footer">
                        <span className="message-time">
                          <div
                            className={`User-info d-flex align-items-center gap-1 ${"flex-row-reverse"}`}
                          >
                            {/* <div className="avatar-card">A</div> */}
                            <small
                              onClick={() =>
                                navigate(`/userprofile/${msg.handle}`)
                              }
                              style={{
                                fontSize: "12px",
                                cursor: "pointer",
                              }}
                            >
                              {`${msg?.handle}`}
                            </small>
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Footer */}
        <div className="chat-footer">
          <div className="input-wrapper">
            <div className="input-container">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => handleChange(e)}
                placeholder="Message"
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSend()
                }
              />
            </div>
            {sendShow ? (
              <button
                disabled={messageInput.trim() == ""}
                className={`mic-button ${
                  chatColor !== "" ? chatColor : singleConversation.theme
                }`}
                onClick={handleSend}
              >
                <SendHorizontal
                  className={
                    chatColor !== "" ? chatColor : singleConversation.theme
                  }
                  color="black"
                />
              </button>
            ) : (
              <button
                disabled={messageInput.trim() == ""}
                className={`mic-button ${
                  chatColor !== "" ? chatColor : singleConversation.theme
                }`}
                onClick={handleSend}
              >
                <SendHorizontal
                  className={
                    chatColor !== "" ? chatColor : singleConversation.theme
                  }
                  color="black"
                />
              </button>
              // <button className={`mic-button ${chatColor!==""?chatColor:singleConversation.theme}`} >
              //   <Mic className={chatColor!==""?chatColor:singleConversation.theme} color="black"/>
              // </button>
            )}
          </div>
        </div>
      </div>
      <Offcanvas
        placement="bottom"
        scroll={true}
        className="off"
        backdrop={true}
        show={show}
        onHide={handleClose}
        style={{
          marginLeft: showSidebar ? "350px" : "0",
          width: showSidebar ? "calc(100vw - 350px)" : "100%",
          height: "500px",
        }}
      >
        <Offcanvas.Header closeButton className="off-header">
          <Offcanvas.Title>Change Theme</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div
            className="btn btn-outline-danger btn-sm py-1 apply-theme-btn"
            style={{ color: "#fd8181ff", borderColor: "#fd8181ff" }}
            onClick={() => {
              setBackground("");
              setChatColor("");
            }}
          >
            {/* #ff1414cb */}
            Default Theme
          </div>
          <div
            className="btn btn-outline-danger btn-sm py-1 ms-2 apply-theme-btn"
            style={{ color: "#fd8181ff", borderColor: "#fd8181ff" }}
            onClick={() => {
              setChatColor("ChatWhatsappTheme");
              setBackground("bg-secondary");
            }}
          >
            Whatsapp Theme
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
              <div className="bgparent d-flex gap-2">
                <div
                  className="box border justify-content-center"
                  onClick={() => setBackground("bg-light")}
                >
                  <Ban size={30} />
                </div>
                {backgrounds.Gradient.map((grad) => (
                  <div
                    className="box overflow-hidden"
                    onClick={() => setBackground(grad)}
                  >
                    <div
                      className={`${grad}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "10px",
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            </Tab>

            <Tab eventKey="Pattern" title="Pattern">
              <div className="bgparent d-flex gap-2">
                <div
                  className="box border justify-content-center"
                  onClick={() => setBackground("bg-light")}
                >
                  <Ban size={30} />
                </div>
                {backgrounds.Pattern.map((pattern) => (
                  <div
                    className="box overflow-hidden"
                    onClick={() => setBackground(pattern)}
                  >
                    <div
                      className={`pattern ${pattern}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "10px",
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            </Tab>

            <Tab eventKey="Animated" title="Animated">
              <div className="bgparent d-flex gap-2">
                <div
                  className="box border justify-content-center"
                  onClick={() => setBackground("bg-light")}
                >
                  <Ban size={30} />
                </div>
                {backgrounds.Animated.map((anim) => (
                  <div
                    className="box overflow-hidden"
                    onClick={() => setBackground(anim)}
                  >
                    <div
                      className={`anim ${anim}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "10px",
                      }}
                    ></div>
                  </div>
                ))}
              </div>
            </Tab>
          </Tabs>

          <div className="changeBg w-50 mt-5 fw-bold">Chat</div>

          <div className="bgparent d-flex gap-2 pb-5">
            <div
              className="box border justify-content-center"
              onClick={() => setChatColor("bg-light text-dark")}
            >
              <Ban size={30} />
            </div>

            {colors.map((col) => (
              <div
                className={`box d-flex justify-content-center flex-column ${
              background == ""
                ? `${
                    singleConversation?.background?.includes("Anim")
                      ? `anim`
                      : `pattern`
                  }`
                : background.includes("Anim")
                ? "anim"
                : "pattern"
            } ${background ? background : singleConversation?.background}`}
                onClick={() => setChatColor(col)}
              >
                <div className="box-recieve-wrap">
                  <div className="box-recieve"></div>
                </div>
                <div className="box-send-wrap">
                  <div className={`box-send ${col}`}></div>
                </div>
                <div className="box-recieve-wrap">
                  <div className="box-recieve"></div>
                </div>
                <div className="box-send-wrap">
                  <div className={`box-send ${col}`}></div>
                </div>
              </div>
            ))}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export const questionWords = [
  "who",
  "what",
  "when",
  "where",
  "why",
  "how",
  "whom",
  "whose",
  "which",
  "is",
  "are",
  "can",
  "could",
  "would",
  "will",
  "do",
  "does",
  "did",
  "may",
  "might",
  "should",
  "shall",
  "has",
  "have",
  "had",
];

export function isQuestion(text) {
  if (!text) return false;

  const trimmed = text?.trim().toLowerCase();

  // Check for question mark
  if (trimmed.endsWith("?")) return true;

  // Check if it starts with a common question word
  return questionWords.some((word) => trimmed.startsWith(word + " "));
}

export const backgrounds = {
  Animated: [
    "AnimBg1",
    "AnimBg2",
    "AnimBg3",
    "AnimBg4",
    "AnimBg5",
    "AnimBg6",
    "AnimBg7",
    "AnimBg8",
    "AnimBg9",
    "AnimBg10",
    "AnimBg11",
    "AnimBg12",
    "AnimBg13",
    "AnimBg14",
    "AnimBg15",
    "AnimBg16",
    "AnimBg17",
    "AnimBg18",
    "AnimBg19",
    "AnimBg20",
    "AnimBg21",
    "AnimBg22",
    "AnimBg23",
    "AnimBg24",
    "AnimBg25",
    "AnimBg26",
    "AnimBg27",
    "AnimBg28",
    "AnimBg29",
    "AnimBg30",
    "AnimBg31",
    "AnimBg32",
    "AnimBg33",
    "AnimBg34",
    "AnimBg35",
    "AnimBg36",
    "AnimBg37",
    "AnimBg38",
    "AnimBg39",
    "AnimBg40",
    "AnimBg41",
    "AnimBg42",
  ],
  Pattern: [
    "PaternBg1",
    "PaternBg2",
    "PaternBg3",
    "PaternBg4",
    "PaternBg5",
    "PaternBg6",
    "PaternBg7",
    "PaternBg8",
    "PaternBg9",
    "PaternBg10",
    "PaternBg11",
    "PaternBg12",
    "PaternBg13",
    "PaternBg14",
    "PaternBg15",
    "PaternBg16",
    "PaternBg17",
    "PaternBg18",
    "PaternBg19",
    "PaternBg20",
    "PaternBg21",
    "PaternBg22",
    "PaternBg23",
    "PaternBg24",
    "PaternBg25",
    "PaternBg26",
    "PaternBg27",
    "PaternBg28",
    "PaternBg29",
    "PaternBg30",
    "PaternBg31",
    "PaternBg32",
    "PaternBg33",
    "PaternBg34",
    "PaternBg35",
    "PaternBg36",
    "PaternBg37",
    "PaternBg38",
    "PaternBg39",
    "PaternBg40",
  ],
  Gradient: [
    "gradient-1",
    "gradient-2",
    "gradient-3",
    "gradient-4",
    "gradient-5",
    "gradient-6",
   
    "gradient-22",
    "gradient-23",
    "gradient-24",
    "gradient-25",
    "gradient-26",
    "gradient-27",
    "gradient-28",
    "gradient-29",
    "gradient-30",
    "gradient-31",
    "gradient-32",
    "gradient-33",
    "gradient-34",
    "gradient-35",
    "gradient-36",
    "gradient-37",
    "gradient-38",
    "gradient-39",
    "gradient-40",
    "gradient-41",
    "gradient-42",
  ],
};

export const colors = [
  "ChatTheme1",
  "ChatTheme2",
  "ChatTheme3",
  "ChatTheme4",
  "ChatTheme5",
  "ChatTheme6",
  "ChatTheme7",
  "ChatTheme8",
  "ChatWhatsappTheme",
  "ChatDefaultTheme",
];
