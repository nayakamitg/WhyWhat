import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import "../../assets/style/template.css";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Virtual } from "swiper/modules";
import domtoimage from "dom-to-image-more";
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share,
  Flag,
  MoreVertical,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Copy,
  ExternalLink,
  Shield,
  AlertTriangle,
  Heart,
  Zap,
  Ban,
  ArrowLeft,
  Music,
  CirclePlus,
  Save,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
// import { Textfit } from "react-textfit";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Mousewheel, Keyboard } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../services/slices/postSlice";
import { Form, Offcanvas, Spinner } from "react-bootstrap";
import { RiShareForwardLine } from "react-icons/ri";
import { RWebShare } from "react-web-share";
import Footer from "./common/Footer";
import toast from "react-hot-toast";
import axios from "axios";
import { login } from "../services/slices/userSlice";
import QRCode from "react-qrcode-logo";
import ThemeContext from "../services/ThemeContext";
import { useTranslation } from "react-i18next";
import { Textfit } from "react-textfit";

const Detail = () => {
  const [page, setPage] = useState("home");
  const [postingComment, setPostingComment] = useState(false);
  const loc = window.location.href.split("/");
  loc.pop();
  const shareLoc = loc.join("/");
  const navigate = useNavigate();
  const param = useParams();
  const mainSwiperRef = useRef(null);
  const storySwiperRefs = useRef({ current: {} });
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const {
    posts: allPosts,
    loading,
    error,
  } = useSelector((state) => state.post);

  // UI states
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const { mode } = useContext(ThemeContext);

  // Individual like states for each story - now stores {isLiked, totalLikes}
  const [likedStories, setLikedStories] = useState({});
  // Individual follow states for each post
  const [followedPosts, setFollowedPosts] = useState({});

  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [myLoading, setMyLoading] = useState(true);
  

  // FIX: Changed to store the specific postId and storyId instead of boolean
  const [activeCommentOffcanvas, setActiveCommentOffcanvas] = useState(null);
  const commentRef = useRef();

  const [comments, setComments] = useState(null);
  const [swipe, setSwipe] = useState(false);
  const [touch, setTouched] = useState(false);
  const [likesLoading, setLikesLoading] = useState({});

  const {
    userData,
    loggedIn,
    loading: authLoading,
    error: authError,
  } = useSelector((state) => state.user);



  // Extract params
  const postId = parseInt(param.id.split(",")[0]);
  const storyId = parseInt(param.id.split(",")[1]);
  console.log(allPosts)

 const reorderedPosts = useMemo(() => {
  return allPosts
    .filter(post => post.type !== "CD")
    .map(post => ({
      ...post,
      stories: post.stories.filter(story => story.answer!=null)
    }));
}, [allPosts]);

console.log("reo",reorderedPosts)
  const initialSlideIndex = reorderedPosts.findIndex((post) => post.id === postId);
  const initialStorySlideIndex = reorderedPosts[
    initialSlideIndex
  ]?.stories?.findIndex((story) => story.id === storyId);


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

  useEffect(() => {
    dispatch(
      fetchPosts({
        search: "",
        nicheId: 0,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  
  // Initialize swipers and handle cleanup
  useEffect(() => {
    if (!storySwiperRefs.current) {
      storySwiperRefs.current = {};
    }
    // return () => {
    //   // cleanup logic here
    //   if (
    //     mainSwiperRef?.current &&
    //     typeof mainSwiperRef.current.destroy === "function"
    //   ) {
    //     mainSwiperRef.current.destroy();
    //     mainSwiperRef.current = null;
    //   }

    //   if (storySwiperRefs?.current) {
    //     Object.entries(storySwiperRefs.current).forEach(([key, swiper]) => {
    //       if (swiper && typeof swiper.destroy === "function") {
    //         try {
    //           swiper.destroy();
    //           delete storySwiperRefs.current[key];
    //         } catch (e) {
    //           console.warn(`Failed to destroy story swiper ${key}:`, e);
    //         }
    //       }
    //     });
    //     storySwiperRefs.current = {};
    //   }
    // };
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);



  // Fetch like status for a story
  const fetchLikeStatus = async (storyId) => {
    if (!userData?.user?.userId) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/Social/like/Answer/${storyId}`,
        {
          headers: {
            "X-User-Id": userData?.user.userId,
          },
        }
      );

      const storyKey = `story-${storyId}`;
      setLikedStories((prev) => ({
        ...prev,
        [storyKey]: {
          isLiked: response.data.isLiked,
          totalLikes: response.data.totalLikes,
        },
      }));
    } catch (e) {
      console.error(
        "Error fetching like status:",
        e.response?.data?.message || e.message
      );
    }
  };

   const fetchTotalLikes = async (storyId) => {
   
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/Likes/target/Answer/${storyId}/count`    
      );

      const storyKey = `story-${storyId}`;
      setLikedStories((prev) => ({
        ...prev,
        [storyKey]: {
          isLiked: response.data.isLiked,
          totalLikes: response.data.totalLikes,
        },
      }));
    } catch (e) {
      console.error(
        "Error fetching like status:",
        e.response?.data?.message || e.message
      );
    }
  };


  // Fetch like status for all visible stories
  useEffect(() => {
    if (userData.user?.userId && reorderedPosts.length > 0) {
      reorderedPosts.forEach((post) => {
        post.stories?.forEach((story) => {
          fetchLikeStatus(story.id);
        });
      });
    }
  }, [userData?.user?.userId, reorderedPosts]);

  // Add like API call
  const addLike = async ({ storyId }) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/Social/like`,
        {
          targetType: "Answer",
          targetId: storyId,
        },
        {
          headers: {
            "X-User-Id": userData?.user?.userId,
          },
        }
      );
      await fetchLikeStatus(storyId);
    } catch (e) {
      console.error(
        e.response?.data?.message || e.message || "Something went wrong"
      );
      toast.error("Failed to update like");
    }
  };

  // Handler for individual story like
  const handleLike = async (postId, storyId) => {
    if (!userData?.user?.userId) {
      navigate("/login");
      return;
    }

    const storyKey = `story-${storyId}`;
    setLikesLoading((prev) => ({ ...prev, [storyKey]: true }));

    const currentState = likedStories[storyKey];
    const newIsLiked = !currentState?.isLiked;
    const newTotalLikes = currentState?.totalLikes
      ? newIsLiked
        ? currentState.totalLikes + 1
        : currentState.totalLikes - 1
      : newIsLiked
      ? 1
      : 0;

    setLikedStories((prev) => ({
      ...prev,
      [storyKey]: {
        isLiked: newIsLiked,
        totalLikes: newTotalLikes,
      },
    }));

    try {
      await addLike({ storyId });
    } catch (error) {
      setLikedStories((prev) => ({
        ...prev,
        [storyKey]: currentState,
      }));
    } finally {
      setLikesLoading((prev) => ({ ...prev, [storyKey]: false }));
    }
  };

  // Handler for individual post follow
  const handleFollow = (postId) => {
    setFollowedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Helper function to check if story is liked
  const isStoryLiked = (storyId) => {
    const storyKey = `story-${storyId}`;
    return likedStories[storyKey]?.isLiked || false;
  };

  // Helper function to check if post is followed
  const isPostFollowed = (postId) => {
    return followedPosts[postId] || false;
  };

  // Helper function to get like count
  const getLikeCount = (storyId) => {
    const storyKey = `story-${storyId}`;
    return likedStories[storyKey]?.totalLikes || 0;
  };
  const getAllComments = async (storyId) => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/Comments/Answer/${storyId}?page=1&pageSize=50`
      );
      setComments(res.data);
    } catch (e) {
      console.log(e);
    }
  };
  // FIX: New function to handle opening comment offcanvas
  const handleShowComments = (postId, storyId) => {
    getAllComments(storyId);

    setActiveCommentOffcanvas({ postId, storyId });
  };

  // FIX: New function to handle closing comment offcanvas
  const handleCloseComments = () => {
    setActiveCommentOffcanvas(null);
    setComments(null);
    commentRef.current.value = "";
  };

  // FIX: New function to check if specific offcanvas should be shown
  const isCommentOffcanvasActive = (postId, storyId) => {
    return (
      activeCommentOffcanvas?.postId === postId &&
      activeCommentOffcanvas?.storyId === storyId
    );
  };






  // FIX: New function to handle comment submission
  const handlePostComment = async () => {
    if (!commentRef.current.value.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    if (!userData?.user?.userId) {
      navigate("/login");
      return;
    }
    try {
      setPostingComment(true)
      // Your API call here
     const res= await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/Comments`,
        {
          targetType: "Answer",
          targetId: activeCommentOffcanvas.storyId,
          commentText: commentRef.current.value,
        },
        {
          headers: {
            "X-User-Id": userData?.user?.userId,
          },
        }
      );
      setComments((pre) => ({
        ...pre,
        data: [
          {
            commentId: comments.data.length + 1,
            targetType: "Answer",
            targetId: storyId,
            userId: userData.user.userId,
            userName: userData.user.userName,
            commentText: commentRef.current.value,
          },
          ...pre.data, // keep previous comments
        ],
      }));
      commentRef.current.value="";
      // handleCloseComments();
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment");
    }
    finally{
      setPostingComment(false)
    }
  };

  useEffect(() => {
    let timerId;

    if (!touch) {
      timerId = setTimeout(() => {
        setSwipe(true);
      }, 10000);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [touch]);

  useEffect(() => {
    let delay = 500;

    const ram = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;

    if (ram <= 2 || cores <= 2) {
      delay = 1500;
    } else if (ram <= 4 || cores <= 4) {
      delay = 1000;
    } else {
      delay = 500;
    }

    if (loading) {
      return (
        <div className="Loader w-100 d-flex justify-content-center align-items-center">
          <Spinner animation="border" />
        </div>
      );
    }

    if (myLoading) {
      window.setTimeout(() => {
        setMyLoading(false);
      }, delay);
    }
  }, [myLoading]);

  // Show loading spinner while posts are being fetched
  if (loading || !allPosts || allPosts.length === 0) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Show error if there's an error or no posts found
  if (error || reorderedPosts.length === 0) {
    return (
      <div
        className="d-flex justify-content-center align-items-center flex-column"
        style={{ height: "100vh" }}
      >
        <h3>Post not found</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }
  
  // Render Like Button Component
  const LikeButton = ({ postId, story }) => {
    const storyKey = `story-${story.id}`;
    const isLiked = isStoryLiked(story.id);
    const likeCount = getLikeCount(story.id);
    const isLoading = likesLoading[storyKey];

    return (
      <>
        <button
          className={`action-btn ${isLiked ? "liked" : ""}`}
          onClick={() => handleLike(postId, story.id)}
          title="Like"
          disabled={isLoading}
        >
          {isLiked ? <AiFillLike size={30} /> : <AiOutlineLike size={30} />}
          <span className="px-1"></span>
          <div className="Actiontitle px-2">{likeCount}</div>
        </button>
      </>
    );
  };

  // Show loading screen with first post data if available
  if (myLoading && reorderedPosts[initialSlideIndex]) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

    return (
      <>
        <div className="QuestionParent">
          <ArrowLeft
            size={40}
            className="mx-3"
            color="#ffff"
            onClick={() => navigate(-1)}
          />
          <p className="Question fw-bold lh-base">
            {reorderedPosts[initialSlideIndex].title}
          </p>
        </div>
        <Swiper
          initialSlide={initialStorySlideIndex}
          direction="horizontal"
          slidesPerView={1}
          spaceBetween={0}
          style={{ height: "100vh" }}
          modules={[Virtual, Mousewheel]}
          virtual
          onSwiper={(swiper) => {
            if (reorderedPosts[initialSlideIndex]) {
              storySwiperRefs.current[reorderedPosts[initialSlideIndex].id] =
                swiper;
            }
          }}
          onDestroy={() => {
            if (
              reorderedPosts[initialSlideIndex] &&
              storySwiperRefs.current[reorderedPosts[initialSlideIndex].id]
            ) {
              delete storySwiperRefs.current[
                reorderedPosts[initialSlideIndex].id
              ];
            }
          }}
        >
          {reorderedPosts[initialSlideIndex]?.stories?.map(
            (story, storyIndexInner) => (
              <SwiperSlide
                key={`story-${reorderedPosts[initialSlideIndex]?.id}-${storyIndexInner}`}
              >
                <div
                  className="shorts-container"
                  onClick={(e) => {
                    if (
                      !e.target.closest(".more-menu") &&
                      !e.target.closest(".report-menu") &&
                      !e.target.closest(".action-btn")
                    ) {
                      setShowMoreMenu(false);
                      setShowReportMenu(false);
                    }
                  }}
                >
                  <div
                    className={`video-area ${story.gradient || "gradient-1"}`}
                  >
                    <Textfit
                      mode="multi"
                      min={12}
                      max={55}
                      style={{
                        height: "60%",
                        width: "100%",
                        textAlign: "justify",
                        display: "flex",
                        alignItems: "center",
                        padding: "0 10px",
                        textIndent: "40px",
                      }}
                    >
                      {story?.answer}
                    </Textfit>
                  </div>

                  {showMoreMenu && (
                    <div className="more-menu">
                      <button
                        className="menu-item d-flex justify-content-between"
                        onClick={() => setIsPlaying((pre) => !pre)}
                      >
                        <span>
                          {isPlaying ? <Pause size={18} /> : <Play size={18} />}{" "}
                          Autoplay
                        </span>
                        <Form.Check
                          type="switch"
                          id="custom-switch"
                          checked={isPlaying}
                        />
                      </button>
                      <button className="menu-item">
                        <ExternalLink size={18} /> Open in new tab
                      </button>
                      <div className="menu-separator"></div>
                      <button
                        className="menu-item"
                        onClick={() => {
                          setShowMoreMenu(false);
                          setShowReportMenu(true);
                        }}
                      >
                        <Flag size={18} /> Report
                      </button>
                      <button className="menu-item">
                        <Ban size={18} /> Not interested
                      </button>
                    </div>
                  )}

                  {showReportMenu && (
                    <div className="report-menu">
                      <button
                        className="back-btn"
                        onClick={() => {
                          setShowReportMenu(false);
                          setShowMoreMenu(true);
                        }}
                      >
                        <ArrowLeft size={18} />{" "}
                        <span className="ms-2">Back</span>
                      </button>
                      <div className="report-header">
                        <p className="report-title">Report video</p>
                        <p className="report-subtitle">
                          Tell us why you're reporting this video
                        </p>
                      </div>
                      <button className="report-option">
                        <Shield size={18} />
                        <div className="report-option-content">
                          <p className="report-option-title">
                            Violent or repulsive content
                          </p>
                          <p className="report-option-desc">
                            Content that promotes violence or hatred
                          </p>
                        </div>
                      </button>
                    </div>
                  )}

                  <div className="video-info py-4">
                    <div
                      className="action-sidebar"
                      onWheel={(e) => e.stopPropagation()}
                      onTouchMove={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => navigate(`/userprofile/${story.handle}`)}
                        className="action-btn"
                        title="Comment"
                      >
                        <div className="author-avatar">
                          <img
                            className="w-100 h-100 rounded-5"
                            onError={(e) => (e.target.src = "/profile.webp")}
                            src={story.avatar}
                            alt=""
                          />
                        </div>

                        <span className="px-1"></span>
                        <div className="Actiontitle px-2">{story.handle}</div>
                      </button>

                      <LikeButton
                        postId={reorderedPosts[initialSlideIndex].id}
                        story={story}
                      />

                      {/* FIX: Updated comment button */}
                      <button
                        onClick={() =>
                          handleShowComments(
                            reorderedPosts[initialSlideIndex].id,
                            story.id
                          )
                        }
                        className="action-btn"
                        title="Comment"
                      >
                        <MessageCircle size={24} />
                        <span className="px-1"></span>
                        <div className="Actiontitle px-2">Comment</div>
                      </button>

                      <RWebShare
                        data={{
                          text: reorderedPosts[initialSlideIndex].description,
                          url:
                            shareLoc +
                            "/" +
                            reorderedPosts[initialSlideIndex].id +
                            "," +
                            story.id,
                        }}
                        title="Share via"
                      >
                        <button className="action-btn" title="Share">
                          <RiShareForwardLine size={24} />
                          <span className="px-1"></span>
                          <div className="Actiontitle px-2">Share</div>
                        </button>
                      </RWebShare>

                      {/* <button
                      className="action-btn"
                      title="More"
                      onClick={() => setIsMuted((pre) => !pre)}
                    >
                      {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                      <span className="px-1"></span>
                      <div className="Actiontitle px-2">
                        {!isMuted ? "Mute" : "Unmute"}
                      </div>
                    </button> */}
                      <DownloadTemplate
                        question={reorderedPosts[initialSlideIndex].description}
                        answer={story}
                        postId={reorderedPosts[initialSlideIndex].id}
                      />

                      <button
                        className="action-btn"
                        title="More"
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                      >
                        <MoreVertical size={24} />
                        <span className="px-1"></span>
                        <div className="Actiontitle px-2">More</div>
                      </button>
                    </div>
                  </div>

                  {/* FIX: Updated Offcanvas with conditional rendering */}
                  <Offcanvas
                    show={isCommentOffcanvasActive(
                      reorderedPosts[initialSlideIndex].id,
                      story.id
                    )}
                    placement="bottom"
                    onHide={handleCloseComments}
                  >
                    <Offcanvas.Header closeButton>
                      <Offcanvas.Title>Comments</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                      <div
                        style={{
                          width: "100%",
                          maxWidth: "700px",
                          flex: 1,
                          overflowY: "auto",
                          padding: "16px",
                        }}
                      >
                        <div className="SingleComment">
                          <div className="commentAvatar"></div>
                          <div className="commentDetails">
                            <div className="commentName">Adam</div>
                            <div className="commentTitle">Nice reply</div>
                            <div className="commentActivity">
                              <span>Like</span>
                              <span>Reply</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="commentInput"
                        style={{
                          position: "sticky",
                          bottom: 0,
                          background: "white",
                          borderTop: "1px solid #ddd",
                          padding: "8px",
                          display: "flex",
                          gap: "8px",
                        }}
                      >
                        <textarea
                          ref={commentRef}
                          placeholder="Add a comment..."
                          style={{
                            flex: 1,
                            resize: "none",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            padding: "6px",
                          }}
                        />
                        <button onClick={handlePostComment}>Post</button>
                      </div>
                    </Offcanvas.Body>
                  </Offcanvas>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          ((storyIndexInner + 1) /
                            reorderedPosts[initialSlideIndex].stories.length) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              </SwiperSlide>
            )
          )}
        </Swiper>
        <Footer />
      </>
    );
  }

  return (
    <>



      <Swiper
        direction="vertical"
        slidesPerView={1}
        initialSlide={initialSlideIndex}
        spaceBetween={0}
        enabled={true}
        modules={[Virtual, Mousewheel, Keyboard]}
        virtual
        onSlideChange={()=> !touch &&setTouched(true)}
        keyboard={{ enabled: true, onlyInViewport: true }}
        style={{ height: "100vh", position: "relative" }}
        mousewheel={{
          forceToAxis: true,
          releaseOnEdges: true,
          sensitivity: 1,
        }}
        onSwiper={(swiper) => {
          mainSwiperRef.current = swiper;
        }}
        // onDestroy={() => {
        //   mainSwiperRef.current = null;
        // }}
      >
        {reorderedPosts.map((post, postIndex) => (
          <SwiperSlide
            key={`post-${post.id}-${postIndex}`}
            style={{ height: "100vh", position: "relative" }}
          >
            <div className="QuestionParent" style={{color:post.background || "black"}}>
              <ArrowLeft
                size={40}
                className="mx-3"
                onClick={() => navigate(-1)}
              style={{color:post.background || "black"}}
               
              />
              <p className="Question  lh-base" style={{color:post.background || "black"}}>{post.title}</p>
            </div>

            <Swiper
              direction="horizontal"
              slidesPerView={1}
              enabled={true}
              onSlideChange={(swiper)=>touch && setTouched(true)}
              mousewheel={{
                forceToAxis: true, // Scroll locked to axis
                releaseOnEdges: true, // Allows page scroll on edges
                sensitivity: 1, // Mousewheel sensitivity
              }}
              initialSlide={initialStorySlideIndex}
              spaceBetween={0}
              modules={[Virtual, Mousewheel, Keyboard]}
              keyboard={{ enabled: true, onlyInViewport: true }}
              virtual
              style={{ height: "100vh" }}
              onDestroy={() => {
                storySwiperRefs.current = null;
              }}
            >
              {post.stories?.map((story, storyIndexInner) => (
                <SwiperSlide key={storyIndexInner}>
                  <div
                    className="shorts-container"
                    onClick={(e) => {
                      if (
                        !e.target.closest(".more-menu") &&
                        !e.target.closest(".report-menu") &&
                        !e.target.closest(".action-btn")
                      ) {
                        setShowMoreMenu(false);
                        setShowReportMenu(false);
                      }
                    }}
                  >
                    <div
                      className={`video-area ${story.gradient?story.gradient: "black"}`}
                    >
                      <Textfit
                        mode="multi"
                        min={14}
                        max={55}
                        onTouchStart={() => setTouched(true)}
                        style={{
                          height: "60%",
                          width: "100%",
                          textAlign: "justify",
                          display: "flex",
                          alignItems: "center",
                          userSelect: "none",
                          padding: "0 10px",
                          textIndent: "40px",
                          color:story?.gradient?story.gradient: "black"
                        }}
                      >
                        {story?.answer}
                      </Textfit>
                    </div>

                    {showMoreMenu && (
                      <div className="more-menu">
                        <button
                          className="menu-item d-flex justify-content-between"
                          onClick={() => setIsPlaying((pre) => !pre)}
                        >
                          <span>
                            {isPlaying ? (
                              <Pause size={18} />
                            ) : (
                              <Play size={18} />
                            )}{" "}
                            {t("autoplay")}
                          </span>
                          <Form.Check
                            type="switch"
                            id="custom-switch"
                            checked={isPlaying}
                          />
                        </button>
                        <button className="menu-item">
                          <Heart size={18} /> {t("mark as favorite")}
                        </button>
                        <button className="menu-item">
                          <ExternalLink size={18} /> {t("open in new tab")}
                        </button>
                        <div className="menu-separator"></div>
                        <button
                          className="menu-item"
                          // onClick={() => {
                          //   // setShowMoreMenu(false);
                          //   // setShowReportMenu(true);
                          // }}
                        >
                          <Flag size={18} /> {t("report")}
                        </button>
                        <button className="menu-item">
                          <Ban size={18} /> {t("not interested")}
                        </button>
                      </div>
                    )}

                    {showReportMenu && (
                      <div className="report-menu">
                        <button
                          className="back-btn"
                          onClick={() => {
                            setShowReportMenu(false);
                            setShowMoreMenu(true);
                          }}
                        >
                          <ArrowLeft size={18} />{" "}
                          <span className="ms-2">Back</span>
                        </button>
                        <div className="report-header">
                          <p className="report-title">Report video</p>
                          <p className="report-subtitle">
                            Tell us why you're reporting this video
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="video-info py-4">
                      <div
                        className="action-sidebar"
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() =>
                            navigate(`/userprofile/${story.handle}`)
                          }
                          className="action-btn"
                          title="Comment"
                        >
                          <div className="author-avatar">
                            <img
                              className="w-100 h-100 rounded-5"
                              onError={(e) => (e.target.src = "/profile.webp")}
                              src={story.avatar}
                              alt=""
                            />
                          </div>

                          <span className="px-1"></span>
                          <div className="Actiontitle px-2">{story.handle}</div>
                        </button>

                        <LikeButton postId={post.id} story={story} />

                        {/* FIX: Updated comment button */}
                        <button
                          onClick={() => handleShowComments(post.id, story.id)}
                          className="action-btn"
                          title="Comment"
                        >
                          <MessageCircle size={24} />
                          <span className="px-1"></span>
                          <div className="Actiontitle px-2">{t("comment")}</div>
                        </button>
                      

                      

                        {/* <button
                          className="action-btn"
                          title="More"
                          onClick={() => setIsMuted((pre) => !pre)}
                        >
                          {isMuted ? (
                            <VolumeX size={24} />
                          ) : (
                            <Volume2 size={24} />
                          )}
                          <span className="px-1"></span>
                          <div className="Actiontitle px-2">
                            {!isMuted ? "Mute" : "Unmute"}
                          </div>
                        </button> */}
                       
                        <ShareTemplate
                          question={post.description}
                          answer={story}
                          postId={post.id}
                        />

                         <DownloadTemplate
                          question={post.description}
                          answer={story}
                          postId={post.id}
                        />

                        {/* <button
                          className="action-btn"
                          title="More"
                          onClick={() => setShowMoreMenu(!showMoreMenu)}
                        >
                          <MoreVertical size={24} />
                          <span className="px-1"></span>
                          <div className="Actiontitle px-2">{t("more")}</div>
                        </button> */}
                      </div>
                    </div>

                    {/* FIX: Updated Offcanvas with conditional rendering */}
                    <Offcanvas
                      show={isCommentOffcanvasActive(post.id, story.id)}
                      placement="bottom"
                      onHide={handleCloseComments}
                      style={{
                        height:"500px",
                        backgroundColor: mode == "dark" ? "#121212" : "white",
                        color: mode == "light" ? "#121212" : "white",
                      }}
                    >
                      <Offcanvas.Header
                        color="white"
                        closeButton
                        style={{
                          color: mode == "dark" ? "#fff" : "black",
                        }}
                        closeVariant={mode == "dark" ? "white" : "black"}
                      >
                        <Offcanvas.Title>Comments</Offcanvas.Title>
                      </Offcanvas.Header>
                      <Offcanvas.Body>
                        <div
                          style={{
                            width: "100%",
                            maxWidth: "700px",
                            flex: 1,
                            overflowY: "auto",
                            padding: "16px",
                          }}
                        >
                          {comments?.data?.length === 0 ? (
                            <div className="w-100 text-center">
                              {t("no comments")}
                            </div>
                          ) : (
                            comments?.data?.map((comment) => (
                              <div className="SingleComment mb-3">
                                <div className="commentAvatar"></div>
                                <div className="commentDetails">
                                  <div className="commentName">
                                    {comment.userName}
                                  </div>
                                  <div className="commentTitle">
                                    {comment?.commentText}
                                  </div>
                                  <div className="commentActivity">
                                    <span>Like</span>
                                    <span>Reply</span>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        <div
                          className="commentInput"
                          style={{
                            position: "fixed",
                            bottom: 0,
                            left: 0,
                            padding: "8px",
                            display: "flex",
                            gap: "8px",
                          }}
                        >
                          <textarea
                            ref={commentRef}
                            placeholder={t("add a comment...")}
                            style={{
                              flex: 1,
                              resize: "none",
                              borderRadius: "4px",
                              padding: "6px",
                              backgroundColor: "transparent",
                              color: mode == "light" ? "black" : "white",
                            }}
                          />
                          <button
                            className="btn btn-secondary text-white"
                            onClick={handlePostComment}
                            
                          >
                            Post
                          </button>
                        </div>
                      </Offcanvas.Body>
                    </Offcanvas>

                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${
                            ((storyIndexInner + 1) /
                              reorderedPosts[initialSlideIndex].stories
                                .length) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}

              <SwiperSlide onClick={() => navigate(`/reply/${post.id}`)}>
                <div className="shorts-container d-flex justify-content-center flex-column align-items-center fs-1 gradient-21">
                  <p
                    style={{
                      fontSize: "60px",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    Write Your Answer
                  </p>
                  <CirclePlus size={80} />

                  {loggedIn && (
                    <div className="author-section position-absolute reply-author-section text-dark">
                      <img
                        src={userData?.user?.profileImage}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/profile.webp";
                        }}
                        className="author-avatar"
                      />
                      <div className="author-info">
                        <p className="author-name">{userData?.user?.name}</p>
                        <p className="author-meta">
                          {userData?.followers?.length}
                        </p>
                      </div>
                      <button
                        className={`follow-btn`}
                        onClick={() => navigate(`/reply/${post.id}`)}
                      >
                        Reply
                      </button>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            </Swiper>
          </SwiperSlide>
        ))}
      </Swiper>

      {swipe && (
        <div
          className="swipeUpLeft"
          onMouseDown={() => {
            setSwipe(false);
            setTouched(true);
          }}
          onTouchStart={() => {
            setSwipe(false);
            setTouched(true);
          }}
        >
         
          <div className="swipeLeft">
            <DotLottieReact src="/SwipeLeft.lottie" loop autoplay />
            <span> {t("next answer")} </span>
          </div>
           <div className="swipeUp">
            <DotLottieReact src="/SwipeUp.lottie" loop autoplay />
            <span> {t("next question")} </span>
          </div>
        </div>
      )}

      <Footer page={page} setPage={setPage} />
    </>
  );
};

export default Detail;



export function ShareTemplate({ question, answer, postId }) {
  // const templateRef = useRef(null);
  const { t } = useTranslation();

 const contentRef = useRef(null);

  const captureAndShare = async () => {
    try {
      // Load html2canvas from CDN
      if (!window.html2canvas) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.async = true;
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // Capture the HTML element as canvas
      const canvas = await window.html2canvas(contentRef.current, {
        backgroundColor: '#ffffff',
       
      });

      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        // Check if Web Share API is available
        if (navigator.share) {
          try {
            const file = new File([blob], 'WhuWho.png', { type: 'image/png' });
            await navigator.share({
              files: [file],
              title: 'Shared Content',
              text: 'Check out this content!',
            });
          } catch (err) {
            if (err.name !== 'AbortError') {
              console.error('Share failed:', err);
              downloadImage(blob);
            }
          }
        } else {
          // Fallback: download the image
          downloadImage(blob);
        }
      });
    } catch (error) {
      console.error('Error capturing content:', error);
      alert('Failed to capture content. Please try again.');
    }
  };

  const downloadImage = (blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'WhoWhy.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loc = window.location.href.split("/");
  loc.pop();
  const qr = loc.join("/");

  return (
    <>
      <button className="action-btn" title="download" onClick={captureAndShare}>
          <RiShareForwardLine size={24} />
        <span className="px-1"></span>
        <div className="Actiontitle px-2">{t("share")}</div>
      </button>

      <div
        ref={contentRef}
        className={`template`}
        style={{
          position: "absolute",
          backgroundColor: "transparent",
          left: "-999999px",
          padding: 0,
          textAlign: "justify",
          border: "1px solid #ccc",
          width: "100vw",
          height: "100vh",
          fontFamily: "Arial",
        }}
      >
        <div
          className="gradient-1"
          style={{
            position: "absolute",
            textAlign: "justify",
            border: "1px solid #ccc",
            width: "100%",
            height: "100vh",
            fontFamily: "Arial",
          }}
        ></div>
        <div style={{ height: "100%" }}>
          <div className="Constent position-absolute text-white p-3">
            <div className="w-100 d-flex flex-column justify-center align-items-center my-1">
              <img src="/logo-dark.png" width={160} alt="" />
            </div>
            <h3 className="templateQuestion fw-normal fs-3">
              <span className="fw-bold">Question:</span> <br /> {question}
            </h3>
            <div className="qrcode w-100 d-flex justify-content-center pt-1">
              <QRCode
                value={`${qr + "/" + postId + "," + answer.id}`} // The URL or text to encode
                logoImage="/icons/favicon-16x16.png" // Path to your logo file
                size={100} // The size of the QR code
                logoWidth={50} // The width of the logo
                logoHeight={50} // The height of the logo
                qrStyle="dots" // Style of the QR code modules ('squares' or 'dots')
                ecLevel="H" // Error correction level. "H" (high) is best for logos.
                // Other customization props
              />
            </div>
            <h3 className="templateAnswer pt-0 mt-0 fw-normal fs-3">
              <span className="fw-bold">Answer:</span> <br /> {answer.answer}
            </h3>
            <div className="tamplateAnswerDetailParant">
              <div className="tamplateAnswerDetail">
                <p>{answer.name}</p>
                <p>{answer.handle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}



export function DownloadTemplate({ question, answer, postId }) {
  const templateRef = useRef(null);
  const { t } = useTranslation();

  const handleDownload = () => {
    if (!templateRef.current) return;

    domtoimage
      .toPng(templateRef.current)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "WhyWho.png";
        link.click();
      })
      .catch((err) => console.error("Error generating image:", err));
  };

  const loc = window.location.href.split("/");
  loc.pop();
  const qr = loc.join("/");

  return (
    <>
      <button className="action-btn" title="download" onClick={handleDownload}>
        <Download size={24} />
        <span className="px-1"></span>
        <div className="Actiontitle px-2">{t("download")}</div>
      </button>

      <div
        ref={templateRef}
        className={`template`}
        style={{
          position: "absolute",
          backgroundColor: "transparent",
          left: "-999999px",
          padding: 0,
          textAlign: "justify",
          border: "1px solid #ccc",
          width: "100vw",
          height: "100vh",
          fontFamily: "Arial",
        }}
      >
        <div
          className="gradient-1"
          style={{
            position: "absolute",
            textAlign: "justify",
            border: "1px solid #ccc",
            width: "100%",
            height: "100vh",
            fontFamily: "Arial",
          }}
        ></div>
        <div style={{ height: "100%" }}>
          <div className="Constent position-absolute text-white p-3">
            <div className="w-100 d-flex flex-column justify-center align-items-center my-1">
              <img src="/logo-dark.png" width={160} alt="" />
            </div>
            <h3 className="templateQuestion fw-normal fs-3">
              <span className="fw-bold">Question:</span> <br /> {question}
            </h3>
            <div className="qrcode w-100 d-flex justify-content-center pt-1">
              <QRCode
                value={`${qr + "/" + postId + "," + answer.id}`} // The URL or text to encode
                logoImage="/icons/favicon-16x16.png" // Path to your logo file
                size={100} // The size of the QR code
                logoWidth={50} // The width of the logo
                logoHeight={50} // The height of the logo
                qrStyle="dots" // Style of the QR code modules ('squares' or 'dots')
                ecLevel="H" // Error correction level. "H" (high) is best for logos.
                // Other customization props
              />
            </div>
            <h3 className="templateAnswer pt-0 mt-0 fw-normal fs-3">
              <span className="fw-bold">Answer:</span> <br /> {answer.answer}
            </h3>
            <div className="tamplateAnswerDetailParant">
              <div className="tamplateAnswerDetail">
                <p>{answer.name}</p>
                <p>{answer.handle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
