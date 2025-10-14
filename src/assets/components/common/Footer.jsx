import React, { useContext, useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { FaCircleUser, FaRegCircleUser } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { login, setUserFromStorage } from "../../services/slices/userSlice";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const [showPopup,setShowPopup]=useState(false)
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate=useNavigate();
  const {
    userData,
    loggedIn,
    loading: authLoading,
    error: authError,
  } = useSelector((state) => state.user);
  const { t } = useTranslation();
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


  useEffect(()=>{
    setShowPopup(false)
  },[location])


  const [nav, setNav] = useState("home");
  useEffect(() => {
    if (location.pathname === "/") setNav("home");
    else if (location.pathname.includes("post")) setNav("post");
    else if (location.pathname.includes("live")) setNav("live");
    else if (location.pathname.includes("help")) setNav("help");
    else if (
      location.pathname.includes("profile") ||
      location.pathname.includes("login")
    )
      setNav("profile");
    else setNav("");
  }, [location]);
  return (
    <>
      <div
        className="footer container-fluid w-100 position-fixed bottom-0 d-flex fw-normal justify-content-between align-items-center px-4"
        style={{ width: "100vw" }}
      >
        <NavLink
          to="/"
          className="d-flex flex-column align-items-center text-dark text-center text-decoration-none footerIcons"
          onClick={() => setNav("home")}
        >
          {nav == "home" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="currentColor"
              className="bi bi-house-door-fill"
              viewBox="0 0 16 16"
            >
              <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="currentColor"
              className="bi bi-house-door"
              viewBox="0 0 16 16"
            >
              <path d="M8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4.5a.5.5 0 0 0 .5-.5v-4h2v4a.5.5 0 0 0 .5.5H14a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM2.5 14V7.707l5.5-5.5 5.5 5.5V14H10v-4a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v4z" />
            </svg>
          )}
          <small
            style={{
              fontSize: "10px",
              fontWeight: "normal",
              width: "40px",
              overflow: "hidden",
            }}
          >
            {t("home")}
          </small>
        </NavLink>

        <NavLink
          to="/live"
          className="d-flex flex-column align-items-center text-dark text-decoration-none footerIcons"
          onClick={() => setNav("live")}
        >
          {nav !== "live" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="currentColor"
              className="bi bi-chat-right-dots pt-1"
              viewBox="0 0 16 16"
            >
              <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2z" />
              <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="currentColor"
              className="bi bi-chat-right-dots-fill pt-1"
              viewBox="0 0 16 16"
            >
              <path d="M16 2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h9.586a1 1 0 0 1 .707.293l2.853 2.853a.5.5 0 0 0 .854-.353zM5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0m4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0m3 1a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
            </svg>
          )}

          <small style={{ fontSize: "10px", fontWeight: "normal" }}>
            {t("conversations")}
          </small>
        </NavLink>
{
  showPopup && <div className="w-100 opacity-25 bg-secondary position-absolute" style={{height:"100vh",left:"0px",bottom:"50px",opacity:0}} onClick={()=>setShowPopup(false)}></div> 
}
 {showPopup && <div
  className="popover-box border position-absolute bg-light p-3 rounded-2 px-4 pe-5"
   onMouseEnter={()=>setShowPopup(true)}
   
  style={{
    width: "200px",
    bottom: "50px",
    left: "50%",
    transform: "translateX(-50%)",
    transition: "opacity 0.2s ease, transform 0.2s ease"
  }}
>
  <p className="w-100" onClick={()=>{setShowPopup(false);navigate("/live")}}>{t("new chat")}</p>
  <p className="w-100" onClick={()=>{setShowPopup(false);navigate("/post")}}>{t("ask question")}</p>
</div>}


<div className="d-flex flex-column align-items-center text-dark text-decoration-none footerIcons" onClick={()=>setShowPopup((pre)=>!pre)} >
 {nav !== "post" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
              fill="currentColor"
              className="bi bi-plus-circle"
              viewBox="0 0 16 16"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="35"
              height="35"
              fill="currentColor"
              className="bi bi-plus-circle-fill"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
            </svg>
          )}
</div>
      

        <NavLink
          to="/help"
          className="d-flex flex-column align-items-center text-dark text-decoration-none footerIcons"
          onClick={() => setNav("help")}
        >
          {nav !== "help" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 4 1 36"
              role="img"
              aria-label="Help Outline Minimal"
            >
              <text
                x="10%"
                y="70%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="Arial, Helvetica, sans-serif"
                fontSize="30"
                fontWeight="700"
                fill="none"
                stroke="black"
                strokeWidth="1.5"
              >
                ?
              </text>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 4 1 36"
              role="img"
              aria-label="Help Filled Minimal"
            >
              <text
                x="10%"
                y="70%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily="Arial, Helvetica, sans-serif"
                fontSize="30"
                fontWeight="700"
                fill="black"
              >
                ?
              </text>
            </svg>
          )}

          <small
            style={{
              fontSize: "10px",
              fontWeight: "normal",
              marginTop: "-5px",
            }}
          >
            {t("help")}
          </small>
        </NavLink>

        <NavLink
          to="/profile"
          className="d-flex flex-column align-items-center text-dark text-decoration-none footerIcons"
          onClick={() => setNav("profile")}
        >
          {loggedIn ? (
            <>
              <img
                src={userData?.user?.profileImage || "/profile.webp"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/profile.webp";
                }}
                width={25}
                height={25}
                alt="profile"
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
              <small style={{ fontSize: "10px", fontWeight: "normal" }}>
                You
              </small>
            </>
          ) : nav === "profile" ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                fill="currentColor"
                className="bi bi-person-fill"
                viewBox="0 0 16 16"
              >
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
              </svg>
              <small style={{ fontSize: "10px", fontWeight: "normal" }}>
                {t("profile")}
              </small>
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                fill="currentColor"
                className="bi bi-person"
                viewBox="0 0 16 16"
              >
                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
              </svg>
              <small style={{ fontSize: "10px", fontWeight: "normal" }}>
                {t("profile")}
              </small>
            </>
          )}
        </NavLink>
      </div>
    </>
  );
};

export default Footer;
