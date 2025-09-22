import { useState } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./assets/components/UI/Layout";
import Home from "./assets/components/Home";
import { Toaster } from "react-hot-toast";
import Detail from "./assets/components/Detail";
import Post from "./assets/components/Post";
import Profile from "./assets/components/Profile";
import NewPost from "./assets/components/NewPost";
import AddReply from "./assets/components/AddReply";
import Test from "./assets/components/Test";
import NestedEmbla from "./assets/components/Test";
import ThemeContext from "./assets/services/ThemeContext";
import LoginContext from "./assets/services/LoginContext";

function App() {
    
    const [userData, setUserData] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
    const [mode, setMode] = useState("light");
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
      ],
    },
    {
      path: "/detail/:id",
      element: <Detail />,
    },
    // {
    //   path: "/test",
    //   element: <NestedEmbla />,
    // },
   
    {
      path: "/post",
      element: <NewPost />,
    },
    {
      path: "/reply/:id",
      element: <AddReply />,
    },
  ]);

  return (

    <>
      <ThemeContext.Provider value={{ mode, setMode }}>
        <LoginContext.Provider value={{userData,setUserData,loggedIn,setLoggedIn}}>
      <RouterProvider router={route} />
      <Toaster position="top-center" reverseOrder={false} />
      </LoginContext.Provider>
      </ThemeContext.Provider>
    </>
  );
}

export default App;
