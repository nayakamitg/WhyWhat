import { useEffect, useState } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./assets/components/UI/Layout";
import Home from "./assets/components/Home";
import { Toaster } from "react-hot-toast";
import Detail, { DownloadTemplate } from "./assets/components/Detail";
import Profile from "./assets/components/Profile";
import NewPost from "./assets/components/NewPost";
import AddReply from "./assets/components/AddReply";
import ThemeContext from "./assets/services/ThemeContext";
import LoginContext from "./assets/services/LoginContext";
import Login from "./assets/components/Login";
import PostContext from "./assets/services/PostContext";
import UserProfile from "./assets/components/UserProfile";
import Help from "./assets/components/Help";
import Live from "./assets/components/Live";
import SearchContext from "./assets/services/SearchContext";
import QuestionDetail from "./assets/components/QuestionDetail";
import WhatsAppChat from "./assets/components/WhatsappChat";
import ChatLayout from "./assets/components/UI/ChatLayout";
import SidebarContext from "./assets/services/SidebarContext";
import WelcomeChat from "./assets/components/common/WelcomeChat";
import { color, scale } from "motion";
import NewChat from "./assets/components/NewChat";
import NewLogin from "./assets/components/NewLogin";
import Notification from "./assets/components/Notification";
import { ToastContainer } from "react-toastify";

function App() {
  const [userData, setUserData] = useState(null);
  const [search, setSearch] = useState(null);
  const [nicheId, setNicheId] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [background, setBackground] = useState("");
  const [chatColor, setChatColor] = useState("");
  const [showSidebar, setShowSidebar] = useState(window.innerWidth > 700);
  const [mode, setMode] = useState(localStorage.getItem("mode") || "light");
  const [postPreData, setPostPreData] = useState({
    questionText: "",
    nicheId: 0,
    askTo: 0,
    language: "",
  });
 const [zoom, setZoom] = useState(() => Number(localStorage.getItem("zoom")) || 100);

  const route = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },

        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/help",
          element: <Help />,
        },
        {
          path: "/notification",
          element: <Notification />,
        },

        {
          path: "/userprofile/:handle",
          element: <UserProfile />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/question/:qid",
          element: <QuestionDetail />,
        },
      ],
    },
    {
      path: "/live",
      element: <ChatLayout />,
      children: [
        {
          index: true,
          element: <WelcomeChat />,
        },
        {
          path: "chat/newchat",
          element: <NewChat />,
        },
        {
          path: "chat/:id",
          element: <WhatsAppChat />,
        },
      ],
    },
    {
      path: "/detail/:id",
      element: <Detail />,
    },

    {
      path: "/post",
      element: <NewPost />,
    },
    {
      path: "/reply/:id",
      element: <AddReply />,
    },
    {
      path: "/dow",
      element: <DownloadTemplate />,
    },
    {
      path: "/newlogin",
      element: <NewLogin />,
    },
  ]);

  useEffect(() => {
    document.body.style.zoom = zoom / 100;
  }, [zoom]);
  return (
    <>
      <ThemeContext.Provider
        value={{
          mode,
          setMode,
          background,
          setBackground,
          chatColor,
          setChatColor,
          zoom,
          setZoom,
        }}
      >
        <LoginContext.Provider
          value={{ userData, setUserData, loggedIn, setLoggedIn }}
        >
          <SearchContext.Provider
            value={{ setSearch, search, setNicheId, nicheId }}
          >
            <SidebarContext.Provider value={{ showSidebar, setShowSidebar }}>
              <PostContext.Provider value={{ setPostPreData, postPreData }}>
                <RouterProvider router={route} />
                <Toaster position="top-center" reverseOrder={false} />
                <div className="w-100 d-flex justify-content-center">
                  <ToastContainer
                    className="myToaster"
                    position="bottom-center"
                    autoClose={2000}
                    hideProgressBar={true}
                    newestOnTop
                    theme="dark"
                  />
                </div>
              </PostContext.Provider>
            </SidebarContext.Provider>
          </SearchContext.Provider>
        </LoginContext.Provider>
      </ThemeContext.Provider>
    </>
  );
}

export default App;

export const zoomLevels = [50, 75, 90, 100, 110, 125, 150];
