import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ThemeContext from "../services/ThemeContext";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Spinner } from "react-bootstrap";
import {
  login,
  logout,
  setUserFromStorage,
} from "../services/slices/userSlice";
import { GoogleLogin } from "@react-oauth/google";

const validateToken = () => {
  const storedGoogleData = localStorage.getItem("googleUserData");
  const storedUserData = localStorage.getItem("userData");

  if (!storedGoogleData) return { isValid: false };

  try {
    const googleData = JSON.parse(storedGoogleData);
    const currentTime = Math.floor(Date.now() / 1000);

    if (googleData.exp && googleData.exp > currentTime) {
      console.log("Token valid");
      return {
        isValid: true,
        googleData,
        userData: storedUserData ? JSON.parse(storedUserData) : null,
      };
    } else {
      console.log("Token expired");
      localStorage.removeItem("googleUserData");
      localStorage.removeItem("userData");
      return { isValid: false };
    }
  } catch (error) {
    console.error("Error validating token:", error);
    localStorage.removeItem("googleUserData");
    localStorage.removeItem("userData");
    return { isValid: false };
  }
};

function decodeJWT(token) {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

export default function NewLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mode } = useContext(ThemeContext);

  const {
    userData,
    loggedIn,
    loading: authLoading,
    error: authError,
  } = useSelector((state) => state.user);
  const [isInitializing, setIsInitializing] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;
    const googleUserData = decodeJWT(token);

    if (googleUserData) {
      // Store Google user data
      localStorage.setItem("googleUserData", JSON.stringify(googleUserData));

      // Try to login with handle
      const handle = `@${googleUserData.email.split("@")[0]}`;
      dispatch(login({ handle, googleData: googleUserData }));
    } else {
      toast.error("Invalid Google token");
    }
  };

  const handleLoginError = () => {
    console.log("Login Failed");
    toast.error("Google login failed");
  };

  useEffect(() => {
    const initializeAuth = () => {
      const { isValid, googleData, userData: storedUserData } = validateToken();

      if (isValid && googleData) {
        if (storedUserData) {
          // User exists in our system, set user data and mark as logged in
          dispatch(setUserFromStorage(storedUserData));
        } else {
          // User has valid Google token but doesn't exist in our system
          // Try to login first
          const handle = `@${googleData.email.split("@")[0]}`;
          dispatch(login({ handle, googleData }));
        }
      } else {
        // No valid token, user needs to login
        dispatch(logout());
      }

      setIsInitializing(false);
    };

    initializeAuth();
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login attempt:", { email, password });
  };

  if (isInitializing || authLoading) {
    return (
      <div
        className="Loader w-100 d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <Spinner animation="border" />
      </div>
    );
  }
  if (loggedIn) {
    navigate(-1);
  }

  return (
    <div
      className={`login-wrapper ${mode == "dark" ? "dark-mode" : "light-mode"}`}
    >
      <div className="login-container">
        <div className="glass-card">
          <div className="card-header">
            <h2 className="login-title">Login</h2>
            <p className="login-subtitle">To know Why and Who</p>
          </div>

          <div>
            <div className="form-group mb-3">
              <label htmlFor="email" className="form-label">
                Username / Email
              </label>
              <input
                type="text"
                className="form-control glass-input"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control glass-input"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="forgot-password mb-4">
              <span
                className="forgot-link"
                onClick={() => alert("Password reset link would be sent")}
              >
                Forgot Password?
              </span>
            </div>

            <button onClick={handleSubmit} className="glass-input w-100">
              Sign In
            </button>

            <div className="divider mb-4 pt-3">
              <span>or continue with</span>
            </div>

            <div className="social-buttons">
              <button className="glass-input positon-relative">
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={handleLoginError}
                  theme="outline"
                  size="large"
                  className="social-btn google-btn"
                />
              </button>

              <button
                onClick={() => alert("Facebook login would be triggered")}
                className="glass-input position-relative"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ position: "absolute", left: "17px" }}
                >
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    fill="#1877F2"
                  />
                </svg>
                <span
                  style={{
                    fontFamily: "Google Sans, arial, sans-serif",
                    fontWeight: "550",
                    fontSize: "14px",
                  }}
                >
                  Login with Facebook
                </span>
              </button>
            </div>
          </div>
        </div>
        {authError && (
          <div className="alert alert-danger mt-3" role="alert">
            {authError}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: start;
          justify-content: center;
          padding: 20px;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s ease;
          position: relative;
        }

        .light-mode {
          background: #ffffff;
        }

        .light-mode .glass-card {
          background: rgba(255, 255, 255, 0.95);
          // border: 2px solid #e0e0e0;
          // box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .light-mode .login-title {
          color: #1a1a2e;
        }

        .light-mode .login-subtitle {
          color: #666;
        }

        .light-mode .form-label {
          color: #333;
        }

        .light-mode .glass-input {
          background: #ffffff;
          border: 2px solid #e0e0e0;
          color: #333;
        }

        .light-mode .glass-input::placeholder {
          color: #999;
        }

        .light-mode .glass-input:focus {
          background: #ffffff;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .light-mode .forgot-link {
          color: #667eea;
        }

        .light-mode .forgot-link:hover {
          color: #5568d3;
        }

        .light-mode .glass-button {
          background: #667eea;
          border: 2px solid #667eea;
          color: white;
        }

        .light-mode .glass-button:hover {
          background: #5568d3;
          border-color: #5568d3;
        }

        .light-mode .divider span {
          color: #666;
        }

        .light-mode .divider::before {
          background: #e0e0e0;
        }

        .light-mode .social-btn {
          background: #ffffff;
          border: 2px solid #e0e0e0;
          color: #333;
         
        }

        .light-mode .social-btn:hover {
          border-color: #667eea;
          background: #f8f9ff;
        }

        .light-mode .signup-link p {
          color: #666;
        }

        .light-mode .signup-span {
          color: #667eea;
        }

        .light-mode .signup-span:hover {
          color: #5568d3;
        }

        .light-mode .toggle-btn {
          background: #ffffff;
          border: 2px solid #e0e0e0;
          color: #333;
        }

        .light-mode .toggle-btn:hover {
          background: #f5f5f5;
        }

        .dark-mode {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        }

        .theme-toggle {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 10;
        }

        .toggle-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          color: white;
          padding: 10px 15px;
          border-radius: 50px;
          cursor: pointer;
          font-size: 20px;
          transition: all 0.3s ease;
        }

        .toggle-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .login-container {
          width: 100%;
          max-width: 450px;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 40px;
          // border: 1px solid rgba(255, 255, 255, 0.2);
          // box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          animation: slideUp 0.5s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .login-title {
          color: white;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .login-subtitle {
          color: rgba(255, 255, 255, 0.8);
          font-size: 16px;
          font-weight: 300;
        }

        .form-label {
          color: white;
          font-weight: 500;
          margin-bottom: 8px;
          font-size: 16px;
        }

        .glass-input {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          padding: 0px 16px;
          color: white;
          font-size: 16px;
          transition: all 0.3s ease;
          height:45px;
          

        }

        .glass-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
          font-size:16px;
        }

        .glass-input:focus {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
          outline: none;
        }

        .forgot-password {
          text-align: right;
        }

        .forgot-link {
          color: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .forgot-link:hover {
          color: white;
          text-decoration: underline;
        }

        .glass-button {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          font-weight: 600;
          padding: 14px;
          border-radius: 12px;
          font-size: 16px;
          transition: all 0.3s ease;
        }

        .glass-button:hover {
          background: rgba(255, 255, 255, 0.3);
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .divider {
          text-align: center;
          position: relative;
        }

        .divider span {
          background: transparent;
          padding: 0 10px;
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
          position: relative;
          z-index: 1;
        }

        .divider::before {
          content: '';
          position: absolute;
          left: 0;
          top: 100%;
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.2);
        }

        .social-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .social-btn {
         width:344px;
          border: 1px solid rgba(255, 255, 255, 1);
          color: white;
          margin: 0 12px;
          padding:8px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          transition: all 0.3s ease;
          font-size:14px
        }
          .nsm7Bb-HzV7m-LgbsSe{
          background:transparent;
          border:none;
          
          color:${mode == "dark" ? "white" : "black"};
          }
          .nsm7Bb-HzV7m-LgbsSe:hover{
          border:none;
          }
          .nsm7Bb-HzV7m-LgbsSe-Bz112c{
          position:absolute;
          left:-10px;
          transform:scale(1.09)
          }

        .social-btn:hover {
          background: rgba(255, 255, 255, 0.2)
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
          
        }

       

        .facebook-btn:hover {
          border-color: #1877F2;
        }
       

        .signup-link {
          text-align: center;
        }

        .signup-link p {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
        }

        .signup-link a, .signup-span {
          color: white;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .signup-link a:hover, .signup-span:hover {
          text-decoration: underline;
        }

        @media (max-width: 576px) {
          .glass-card {
        
            padding: 30px 25px;
          }

          .login-title {
            font-size: 26px;
          }

          .social-btn span {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
