import React, { useEffect, useState } from "react";
import "../style/post.css";
import { Ban, Languages, MoreVertical, X } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";
import Dropdown from "react-bootstrap/Dropdown";
import { addStory, fetchPostsSuccess } from "../services/slices/postSlice";
import { useDispatch, useSelector } from "react-redux";

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
  const { posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const [grad, setGrad] = useState(null);
  const { id } = useParams();

  console.log("posts",posts)

  useEffect(() => {
    if (posts.length <= 0) {
      dispatch(fetchPostsSuccess());
    }
  }, [dispatch]);

  const index = posts.findIndex((post) => post.id == id);

  const [postData, setPostData] = useState({
    id: posts.length,
    name: "Adam",
    answer: "",
    followers: "8.7K",
    views: "20K",
    gradient: "",
  });

  console.log("Post", postData);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData((pre) => ({
      ...pre,
      [name]: value,
    }));
  };
  console.log("post", postData);

  const handlePost = () => {
    if (!postData.answer.trim()) return;

    const newStory = {
      ...postData,
      gradient: grad || "",
      id: posts[index]?.stories?.length + 1 || 1,
    };
    console.log("Postdlkfvm;", newStory);
    setIsPosting(true);
    dispatch(
      addStory({
        postId: id,
        story: newStory,
      })
    );
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
      answer: "",
    }));
    setGrad(null);
  };

  const getTextSizeClass = (text) => {
    const length = text.length;
    if (length <= 50) return "short-text";
    if (length <= 100) return "medium-text";
    if (length <= 200) return "long-text";
    return "very-long-text";
  };

  return (
    <>
      <div className={`${grad}`}>
        <div className={`post-creator bg-transparent`}>
          {/* Header */}
          <div className="header border-0 bg-transparent">
            <div className="profile-section bg-transparent">
              <button className="close-btn" onClick={() => navigate(-1)}>
                <X color="black" size={30} />
              </button>
            </div>

            <div className="action-buttons">
              <Dropdown>
                <Dropdown.Toggle as="button" className="btn btn-light">
                  <Languages />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item>हिन्दी</Dropdown.Item>
                  <Dropdown.Item>English</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <button className="btn-reset" onClick={handleReset}>
                Reset
              </button>
              <button
                className="btn-post"
                onClick={handlePost}
                disabled={!postData.answer.trim() || isPosting}
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
              className={`bg-transparent border-0 form-control ${getTextSizeClass(
                postData.answer
              )}`}
              placeholder="Type your Answer..."
              value={postData.answer}
              name="answer"
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
                  onClick={() => setActiveMode("mic")}
                >
                  Voice
                </button>
              </div>
            </div>

            <div
              className={`char-count ${
                postData.answer.length > 125
                  ? "danger"
                  : postData.answer.length > 100
                  ? "warning"
                  : ""
              }`}
            >
              {postData.answer.length}/150
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddReply;
