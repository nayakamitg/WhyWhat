import React, { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import {
  login,
  logout,
  setUserFromStorage,
} from "../services/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router";

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

const Login = () => {
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
      console.error("Invalid Google token");
    }
  };

  const handleLoginError = () => {
    console.log("Login Failed");
    console.error("Google login failed");
  };

  useEffect(() => {
    const initializeAuth = () => {
      const { isValid, googleData, userData: storedUserData } = validateToken();

      if (isValid && googleData) {
         {
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
    <>
      <div className="w-75 m-auto pt-5 text-center">
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
          theme="outline"
          size="large"
        />
        {authError && (
          <div className="alert alert-danger mt-3" role="alert">
            {authError}
          </div>
        )}
      </div>
    </>
  );
};

export default Login;
