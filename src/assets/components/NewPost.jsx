import React, { useContext, useEffect, useRef, useState } from "react";
import "../style/post.css";
import { Languages, MoreVertical, X } from "lucide-react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import Dropdown from "react-bootstrap/Dropdown";
import { useDispatch, useSelector } from "react-redux";
import {
  addPost,
  fetchPostsStart,
  fetchPostsSuccess,
} from "../services/slices/postSlice.jsx";
import ThemeContext from "../services/ThemeContext.js";
import LoginContext from "../services/LoginContext.js";
import { Form } from "react-bootstrap";

const NewPost = () => {
  const navigate = useNavigate();
  const [isPosting, setIsPosting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeMode, setActiveMode] = useState("text"); // 'text' or 'mic'
  const { posts, loading, error } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const { mode, setMode } = useContext(ThemeContext);
  const { userData } = useContext(LoginContext);
  const [tagged, setTagged] = useState([
    "@amit",
    "@sohan",
    "@rohan",
    "@adam",
    "@ram",
  ]);
  const [searchInput, setSearchInput] = useState("");
  const [tag, setTag] = useState("Public");
  const [postData, setPostData] = useState({
    id: 0,
    title: "",
    name: "Aarav",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
    description: "",
    stories: [],
  });

  useEffect(() => {
    if (posts.length <= 0) {
      dispatch(fetchPostsStart());
      dispatch(fetchPostsSuccess());
    }
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData((pre) => ({
      ...pre,
      [name]: value,
    }));
  };
  console.log("post", postData);
  const handlePost = () => {
    if (!postData.description.trim()) return;
    dispatch(
      addPost({
        ...postData,
        id: posts.length + 1,
      })
    );
    setIsPosting(true);

    setTimeout(() => {
      setIsPosting(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }, 1000);
  };

  useEffect(() => {
    if (showSuccess) {
      toast.success("Post successfully created");
      navigate("/");
    }
  }, [showSuccess]);

  const handleReset = () => {
    setPostData((pre) => ({
      ...pre,
      description: "",
    }));
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

  const handleTagAdd = () => {
    console.log(inputRef.current.value);
    setTagged((pre) => [...pre, inputRef.current.value]);
  };

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
          <div className="profile-section">
            <button className="close-btn" onClick={() => navigate(-1)}>
              <X color={mode === "light" ? "black" : "white"} size={30} />
            </button>

            <div className="profile-pic">
              <img
                src={`${userData?.picture || "/profile.webp"}`}
                className="rounded-5"
                width={40}
                alt=""
              />
            </div>
            <div className="profile-info">
              <h6>Name</h6>
              <small>{tag}</small>
            </div>
            <Dropdown>
              <Dropdown.Toggle as="button" className="border-0 bg-transparent">
                <MoreVertical
                  className="mt-2"
                  color={mode === "light" ? "black" : "white"}
                  size={22}
                />
              </Dropdown.Toggle>
              <Dropdown.Menu
                className={`position-absolute border language ${
                  mode == "light" ? "bg-white text-dark" : "bg-dark text-white"
                }`}
              >
                <label htmlFor="" className="fs-6 ps-2">
                  Tag someone
                </label>
                <br />
                <Dropdown className="border m-2 p-1 rounded">
                  <Dropdown.Toggle
                    as="button"
                    className= {`border-0 ${mode == "light" ? "bg-white text-dark" : "bg-dark text-white"}`}
                  >
                    Select Someone
                  </Dropdown.Toggle>

                  <Dropdown.Menu
                    className={`position-absolute border language ${
                      mode == "light" ? "bg-white text-dark" : "bg-dark text-white"
                    }`}
                  >
                    <input
                      type="text"
                      className={`border px-2 mx-2 ${ mode == "light" ? "bg-white text-dark" : "bg-dark text-white"}`}
                      onChange={(e) => handleTagSearch(e)}
                      placeholder="Search"
                    />

                   {(searchInput=="" || "Public".toLowerCase().includes(searchInput.toLowerCase()) )&& <Dropdown.Item className={`border-bottom ${ mode == "light" ? "bg-white text-dark" : "bg-dark text-white"}`} onClick={() => setTag("Public")}>
                      Public
                    </Dropdown.Item>}

                    {tagged
                      .filter((tag) =>
                        tag.replace("@", "").toLowerCase().startsWith(searchInput.toLowerCase())
                      )
                      .map((tag) => (
                        <Dropdown.Item className={`border-bottom ${ mode == "light" ? "bg-white text-dark" : "bg-dark text-white"}`} onClick={() => setTag(tag)}>
                          {tag}
                        </Dropdown.Item>
                      ))}
                  </Dropdown.Menu>
                </Dropdown>

                {/* <div className="div"> */}
                {/* <Form.Check // prettier-ignore
        type="switch"
        id="custom-switch"
        label="Public"
        
        className={`ms-3 my-2 ${mode=="light"?"text-dark":"text-white"}`}
      /></div>
      <div className="taggedList">
{
  tagged.map((tag)=><p className="SingleTag my-0">{tag} <X color="red" size={14}/></p>)
  
}
<p className="SingleTag my-0 border-danger text-danger">Clear All <X color="red" size={14}/></p>
      </div>
     <input
              type="text"
              placeholder="Tag someone type @"
              ref={inputRef}

              className={`TagSomeOne rounded-5 px-4 mx-1 my-2 bg-transparent ${mode=="light"?"text-dark":"text-white"}`}
            />
            <button onClick={handleTagAdd}>Sent</button> */}

              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="action-buttons">
            <Dropdown>
              <Dropdown.Toggle as="button" className="border-0 bg-transparent">
                <Languages
                  className="mx-2 mt-2"
                  color={mode === "light" ? "black" : "white"}
                  size={22}
                />
              </Dropdown.Toggle>
              <Dropdown.Menu className={`border position-absolute language ${mode == "light" ? "bg-white text-dark" : "bg-dark text-white"}`}>
                <Dropdown.Item className={`border-bottom ${mode == "light" ? "bg-white text-dark" : "bg-dark text-white"}`}>हिन्दी</Dropdown.Item>
                <Dropdown.Item className={`${mode == "light" ? "bg-white text-dark" : "bg-dark text-white"}`}>English</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <button className="btn-reset" onClick={handleReset}>
              Reset
            </button>
            <button
              className="btn-post"
              onClick={handlePost}
              disabled={!postData.description.trim() || isPosting}
            >
              {isPosting ? "Posting" : "Post"}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {/* <div className="container-fluid d-flex justify-content-between my-1">
            <input
              type="text"
              placeholder="Tag someone type @"
              className="TagSomeOne rounded-5 px-4"
            />
          </div> */}

          <textarea
            className={`form-control ${getTextSizeClass(postData.description)} ${mode=="light"?"":"bg-dark text-white"}`}
            placeholder="Type Your Question..."
            value={postData.description}
            name="description"
            onChange={(e) => handleChange(e)}
            maxLength={150}
          />
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
                Text
              </button>
              <button
                className={`media-btn ${activeMode === "mic" ? "active" : ""}`}
                onClick={() => setActiveMode("mic")}
              >
                Voice
              </button>
            </div>
          </div>

          <div
            className={`char-count ${
              postData.description.length > 125
                ? "danger"
                : postData.description.length > 100
                ? "warning"
                : ""
            }`}
          >
            {postData.description.length}/150
          </div>
        </div>
      </div>
    </>
  );
};

export default NewPost;
