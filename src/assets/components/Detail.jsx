import React, { useEffect, useMemo, useRef, useState } from "react";
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
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { Textfit } from "react-textfit";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Mousewheel } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
} from "../services/slices/postSlice";
import { Form } from "react-bootstrap";
import { posts } from "../posts";
import { FaShare } from "react-icons/fa6";
import { RiShareForwardLine } from "react-icons/ri";

const Detail = () => {
  const navigate = useNavigate();
  const param = useParams();

  const dispatch = useDispatch();
  const {
    posts: allPosts,
    loading,
    error,
  } = useSelector((state) => state.post);

  // UI states
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  
  // Individual like states for each story
  const [likedStories, setLikedStories] = useState({});
  // Individual follow states for each post
  const [followedPosts, setFollowedPosts] = useState({});
  
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [myLoading, setMyLoading] = useState(true);

  // Extract params
  const postId = parseInt(param.id.split(",")[0]);
  const storyId = parseInt(param.id.split(",")[1]);

  // fetch posts from redux (local data for now)
  useEffect(() => {
    if(!allPosts || allPosts.length === 0){
    dispatch(fetchPostsStart());
    try {
      dispatch(fetchPostsSuccess(posts)); // local posts
    } catch (err) {
      dispatch(fetchPostsFailure("Failed to load posts"));
    }
  }
  }, [dispatch]);

  const reorderedPosts = useMemo(() => {
    console.log("rerendering post");
    if (!allPosts || allPosts.length === 0) return [];

    const targetPostIndex = allPosts.findIndex((post) => post.id === postId);
    if (targetPostIndex === -1) return allPosts;

    const postsCopy = [...allPosts];
    const targetPost = { ...postsCopy[targetPostIndex] };

    const storyIndex = targetPost.stories.findIndex((sid) => sid.id == storyId);

    if (targetPost.stories?.length > storyIndex) {
      const targetStory = targetPost.stories[storyIndex];
      const otherStories = targetPost.stories.filter(
        (_, idx) => idx !== storyIndex
      );
      targetPost.stories = [targetStory, ...otherStories];
    }

    const otherPosts = postsCopy.filter((_, idx) => idx !== targetPostIndex);
    return [targetPost, ...otherPosts];
  }, [postId, storyId, allPosts]);

  // Handler for individual story like
  const handleLike = (postId, storyId, currentLikes) => {
    const storyKey = `${postId}-${storyId}`;
    const isCurrentlyLiked = likedStories[storyKey];
    
    setLikedStories(prev => ({
      ...prev,
      [storyKey]: !isCurrentlyLiked
    }));
    
    // You can also update the actual post data here if needed
    // For now, we're just tracking the UI state
  };

  // Handler for individual post follow
  const handleFollow = (postId) => {
    setFollowedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Helper function to check if story is liked
  const isStoryLiked = (postId, storyId) => {
    const storyKey = `${postId}-${storyId}`;
    return likedStories[storyKey] || false;
  };

  // Helper function to check if post is followed
  const isPostFollowed = (postId) => {
    return followedPosts[postId] || false;
  };

  // Helper function to get like count
  const getLikeCount = (postId, storyId, originalLikes) => {
    const storyKey = `${postId}-${storyId}`;
    const isLiked = likedStories[storyKey];
    if (isLiked === undefined) return originalLikes;
    return isLiked ? originalLikes + 1 : originalLikes;
  };

  useEffect(() => {
    let delay = 500; // default 0.5s

    const ram = navigator.deviceMemory || 4; // fallback 4GB
    const cores = navigator.hardwareConcurrency || 4; // fallback 4 cores

    // low-end device → jyada delay
    if (ram <= 2 || cores <= 2) {
      delay = 1500;
    } else if (ram <= 4 || cores <= 4) {
      delay = 1000;
    } else {
      delay = 500; // fast devices
    }

    if (myLoading) {
      window.setTimeout(() => {
        setMyLoading(false);
      }, delay);
    }
  }, [myLoading]);

  const [count,setCount]=useState(1)
  const handleClick=()=>{
setCount((pre)=>pre+1)
  }

  // Show loading spinner while posts are being fetched
  if (loading || !allPosts || allPosts.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Show error if there's an error or no posts found
  if (error || reorderedPosts.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center flex-column" style={{ height: "100vh" }}>
        <h3>Post not found</h3>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  // Show loading screen with first post data if available
  if (myLoading && reorderedPosts[0]) {
    return (
      <>
        <div className="QuestionParent">
          <p className="fs-3 Question">
            <ArrowLeft
              size={40}
              className="mx-3"
              onClick={() => navigate(-1)}
            />
            {reorderedPosts[0].description}
          </p>
        </div>
        <Swiper
          direction="horizontal"
          slidesPerView={1}
          spaceBetween={0}
          style={{ height: "100vh" }}
          modules={[Mousewheel]}
        >
          {reorderedPosts[0]?.stories?.map((story, storyIndexInner) => (
            <SwiperSlide
              key={`story-${reorderedPosts[0]?.id}-${storyIndexInner}`}
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
                {/* Video Area */}
                <div className="video-area">
                  <Textfit
                    mode="multi"
                    min={12}
                    max={55}
                    style={{
                      height: "100%",
                      width: "100%",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {story?.answer}
                  </Textfit>
                </div>

            

                {/* Video Information */}
                <div className="video-info py-5">


   <div className="action-sidebar">
                      <button
                        className={`action-btn ${isStoryLiked(reorderedPosts[0].id, story.id) ? 'liked' : ''}`}
                        onClick={() => handleLike(reorderedPosts[0].id, story.id, story.likes)}
                        title="Like"
                      >
                        {
                          !isStoryLiked(reorderedPosts[0].id, story.id)?
                        <AiOutlineLike size={30}/>:
                        <AiFillLike size={30}/>
                        }
                      <div className="action-count">{getLikeCount(reorderedPosts[0].id, story.id, story.likes)}</div>
                      </button>

                      <button className="action-btn" title="Comment">
                        <MessageCircle size={24} />
                      </button>
                      <div className="action-count">{story?.comments}</div>

                      <button className="action-btn" title="Share">
                        <RiShareForwardLine size={24}/>
                      </button>
                      <div className="action-count">{story?.shares}</div>

                      <button
                        className="action-btn"
                        title="More"
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                      >
                        <MoreVertical size={24} />
                      </button>
                      <button
                        className="action-btn"
                        title="More"
                        onClick={() => setIsMuted((pre) => !pre)}
                      >
                        {isMuted ? <VolumeX size={24}/> : <Volume2 size={24}/>}
                      </button>

                      {/* More Menu */}
                      {showMoreMenu && (
                        <div className="more-menu">
                          <button className="menu-item d-flex justify-content-between"
                          onClick={()=>setIsPlaying((pre)=>!pre)}
                          >
                            <span>
                            {isPlaying?
                              <Pause size={18} />:
                              <Play size={18}/>
                              } Autoplay</span>
                             <Form.Check 
                             type="switch"
                             id="custom-switch"
                              checked={isPlaying}              
                           />
                          </button>
                          <button className="menu-item">
                            <Download size={18} /> Download
                          </button>
                          <button className="menu-item">
                            <Copy size={18} /> Copy link
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

                      {/* Report Menu */}
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

                          <button className="report-option">
                            <AlertTriangle size={18} />
                            <div className="report-option-content">
                              <p className="report-option-title">
                                Hateful or abusive content
                              </p>
                              <p className="report-option-desc">
                                Content that promotes hatred or abuse
                              </p>
                            </div>
                          </button>

                          <button className="report-option">
                            <Heart size={18} />
                            <div className="report-option-content">
                              <p className="report-option-title">
                                Harassment or bullying
                              </p>
                              <p className="report-option-desc">
                                Content intended to harass or bully
                              </p>
                            </div>
                          </button>

                          <button className="report-option">
                            <Zap size={18} />
                            <div className="report-option-content">
                              <p className="report-option-title">
                                Harmful or dangerous acts
                              </p>
                              <p className="report-option-desc">
                                Content showing dangerous activities
                              </p>
                            </div>
                          </button>

                          <button className="report-option">
                            <Copy size={18} />
                            <div className="report-option-content">
                              <p className="report-option-title">
                                Misinformation
                              </p>
                              <p className="report-option-desc">
                                False or misleading content
                              </p>
                            </div>
                          </button>

                          <button className="report-option">
                            <Ban size={18} />
                            <div className="report-option-content">
                              <p className="report-option-title">
                                Spam or misleading
                              </p>
                              <p className="report-option-desc">
                                Unwanted repetitive content
                              </p>
                            </div>
                          </button>
                        </div>
                      )}
                    </div>



                  <div className="author-section">
                    <img
                      src={reorderedPosts[0]?.avatar}
                      alt={reorderedPosts[0]?.name}
                      className="author-avatar"
                    />
                    <div className="author-info">
                      <p className="author-name">{story?.name}</p>
                      <p className="author-meta">{story?.followers}</p>
                    </div>
                    <button
                      className={`follow-btn ${isPostFollowed(reorderedPosts[0].id) ? "following" : ""}`}
                      onClick={() => handleFollow(reorderedPosts[0].id)}
                    >
                      {isPostFollowed(reorderedPosts[0].id) ? "Following" : "Follow"}
                    </button>
                  </div>

                
                </div>

                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    );
  }

  return (
    <>
      <Swiper
        direction="vertical"
        slidesPerView={1}
        spaceBetween={0}
        style={{ height: "100vh" }}
        modules={[Mousewheel]}
      >
      
        {reorderedPosts.map((post, postIndex) => (
          <SwiperSlide key={`post-${post.id}-${postIndex}`}>
            <div className="QuestionParent">
              <p className="fs-3 Question">
                <ArrowLeft
                  size={40}
                  className="mx-3"
                  onClick={() => navigate(-1)}
                />
                {post.description}
              </p>
            </div>

            <Swiper
              direction="horizontal"
              slidesPerView={1}
              spaceBetween={0}
              style={{ height: "100vh" }}
              modules={[Mousewheel]}
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
                    {/* Video Area */}
                    <div className="video-area">
                      <Textfit
                        mode="multi"
                        min={12}
                        max={55}
                        style={{
                          height: "100%",
                          width: "100%",
                          textAlign: "center",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {story?.answer}
                      </Textfit>
                    </div>

                   
                    

                    {/* Video Information */}
                    <div className="video-info py-5">
 {/* Action Sidebar */}
<div className="action-sidebar">
                      <button
                        className={`action-btn ${isStoryLiked(post.id, story.id) ? 'liked' : ''}`}
                        onClick={() => handleLike(post.id, story.id, story.likes)}
                        title="Like"
                      >
                        {
                          !isStoryLiked(post.id, story.id)?
                        <AiOutlineLike size={30}/>:
                        <AiFillLike size={30}/>
                        }
                      <div className="action-count">{getLikeCount(post.id, story.id, story.likes)}</div>
                      </button>

                      <button className="action-btn" title="Comment">
                        <MessageCircle size={24} />
                      </button>
                      <div className="action-count">{story?.comments}</div>

                      <button className="action-btn" title="Share">
                        <RiShareForwardLine size={24}/>
                      </button>
                      <div className="action-count">{story?.shares}</div>

                      <button
                        className="action-btn"
                        title="More"
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                      >
                        <MoreVertical size={24} />
                      </button>
                      <button
                        className="action-btn"
                        title="More"
                        onClick={() => setIsMuted((pre) => !pre)}
                      >
                        {isMuted ? <VolumeX size={24}/> : <Volume2 size={24}/>}
                      </button>

                      {/* More Menu */}
                      {showMoreMenu && (
                        <div className="more-menu">
                          <button className="menu-item d-flex justify-content-between"
                          onClick={()=>setIsPlaying((pre)=>!pre)}
                          >
                            <span>
                            {isPlaying?
                              <Pause size={18} />:
                              <Play size={18}/>
                              } Autoplay</span>
                             <Form.Check 
                             type="switch"
                             id="custom-switch"
                              checked={isPlaying}              
                           />
                          </button>
                          <button className="menu-item">
                            <Download size={18} /> Download
                          </button>
                          <button className="menu-item">
                            <Copy size={18} /> Copy link
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

                      {/* Report Menu */}
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

                          <button className="report-option">
                            <AlertTriangle size={18} />
                            <div className="report-option-content">
                              <p className="report-option-title">
                                Hateful or abusive content
                              </p>
                              <p className="report-option-desc">
                                Content that promotes hatred or abuse
                              </p>
                            </div>
                          </button>

                          <button className="report-option">
                            <Heart size={18} />
                            <div className="report-option-content">
                              <p className="report-option-title">
                                Harassment or bullying
                              </p>
                              <p className="report-option-desc">
                                Content intended to harass or bully
                              </p>
                            </div>
                          </button>

                          <button className="report-option">
                            <Zap size={18} />
                            <div className="report-option-content">
                              <p className="report-option-title">
                                Harmful or dangerous acts
                              </p>
                              <p className="report-option-desc">
                                Content showing dangerous activities
                              </p>
                            </div>
                          </button>

                          <button className="report-option">
                            <Copy size={18} />
                            <div className="report-option-content">
                              <p className="report-option-title">
                                Misinformation
                              </p>
                              <p className="report-option-desc">
                                False or misleading content
                              </p>
                            </div>
                          </button>

                          <button className="report-option">
                            <Ban size={18} />
                            <div className="report-option-content">
                              <p className="report-option-title">
                                Spam or misleading
                              </p>
                              <p className="report-option-desc">
                                Unwanted repetitive content
                              </p>
                            </div>
                          </button>
                        </div>
                      )}
                    </div>


                      <div className="author-section">
                        <img
                          src={post?.avatar}
                          alt={story?.name}
                          className="author-avatar"
                        />
                        <div className="author-info">
                          <p className="author-name">{story?.name}</p>
                          <p className="author-meta">{story?.followers}</p>
                        </div>
                        <button
                          className={`follow-btn ${
                            isPostFollowed(post.id) ? "following" : ""
                          }`}
                          onClick={() => handleFollow(post.id)}
                        >
                          {isPostFollowed(post.id) ? "Following" : "Follow"}
                        </button>
                      </div>

                      {/* <div className="video-title">
                        <Music /> Playing Music
                      </div> */}
                    </div>

                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${
                            ((storyIndexInner + 1) / post.stories.length) * 100
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
                    {" "}
                    Write Your Answer
                  </p>
                  <CirclePlus size={80} />
                </div>
              </SwiperSlide>
            </Swiper>
          </SwiperSlide>
        ))}

      </Swiper>
    </>
  );
};

export default Detail;