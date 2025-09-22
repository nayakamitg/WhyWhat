import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
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
import { Textfit } from "react-textfit";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
} from "../services/slices/postSlice";
import { posts } from "../posts";

// Custom CSS for better performance
const sliderStyles = {
  height: '100vh',
  width: '100vw',
  overflow: 'hidden'
};

const slideStyles = {
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column'
};

const Test = () => {
  const navigate = useNavigate();
  const param = useParams();
  const dispatch = useDispatch();

  const {
    posts: allPosts
  } = useSelector((state) => state.post);

  // Extract params
  const postId = parseInt(param.id.split(",")[0]);
  const storyId = parseInt(param.id.split(",")[1]);

  // Individual state tracking for instant responses
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [likedStories, setLikedStories] = useState(new Set());
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  // Load posts
  useEffect(() => {
    if (!allPosts || allPosts.length === 0) {
      dispatch(fetchPostsStart());
      try {
        dispatch(fetchPostsSuccess(posts));
      } catch (err) {
        dispatch(fetchPostsFailure("Failed to load posts"));
      }
    }
  }, [dispatch, allPosts]);

  const reorderedPosts = useMemo(() => {
    if (!allPosts || allPosts.length === 0) return [];

    const targetPostIndex = allPosts.findIndex((post) => post.id === postId);
    if (targetPostIndex === -1) return allPosts;

    const postsCopy = [...allPosts];
    const targetPost = { ...postsCopy[targetPostIndex] };

    const storyIndex = targetPost.stories?.findIndex((story) => story.id == storyId) || 0;

    if (targetPost.stories?.length > storyIndex) {
      const targetStory = targetPost.stories[storyIndex];
      const otherStories = targetPost.stories.filter((_, idx) => idx !== storyIndex);
      targetPost.stories = [targetStory, ...otherStories];
    }

    const otherPosts = postsCopy.filter((_, idx) => idx !== targetPostIndex);
    return [targetPost, ...otherPosts];
  }, [postId, storyId, allPosts]);

  // Flatten all slides for single slider approach (much better performance)
  const allSlides = useMemo(() => {
    const slides = [];
    reorderedPosts.forEach((post, postIndex) => {
      // Add question slide
      slides.push({
        type: 'question',
        post,
        postIndex,
        id: `question-${post.id}`
      });
      
      // Add story slides
      post.stories?.forEach((story, storyIndex) => {
        slides.push({
          type: 'story',
          post,
          story,
          postIndex,
          storyIndex,
          id: `story-${post.id}-${story.id}`
        });
      });
    });
    return slides;
  }, [reorderedPosts]);

  // Single vertical slider for all content
  const [sliderRef, instanceRef] = useKeenSlider({
    vertical: true,
    loop: false,
    slides: {
      perView: 1,
      spacing: 0,
    },
    slideChanged: (slider) => {
      const currentSlide = allSlides[slider.track.details.rel];
      if (currentSlide?.type === 'story') {
        setCurrentPostIndex(currentSlide.postIndex);
        setCurrentStoryIndex(currentSlide.storyIndex);
      }
    },
  });

  // Instant response handlers with useCallback
  const handleFollow = useCallback((userId, e) => {
    e?.stopPropagation();
    setFollowedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  }, []);

  const handleLike = useCallback((storyId, e) => {
    e?.stopPropagation();
    setLikedStories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(storyId)) {
        newSet.delete(storyId);
      } else {
        newSet.add(storyId);
      }
      return newSet;
    });
  }, []);

  // Render slide content based on type
  const renderSlide = useCallback((slideData, index) => {
    if (slideData.type === 'question') {
      return (
        <div key={slideData.id} className="keen-slider__slide" style={slideStyles}>
          <div className="QuestionParent">
            <p className="fs-3 Question">
              <ArrowLeft
                size={40}
                className="mx-3"
                onClick={() => navigate(-1)}
                style={{ cursor: 'pointer' }}
              />
              {slideData.post.description}
            </p>
          </div>
        </div>
      );
    }

    if (slideData.type === 'story') {
      const { post, story } = slideData;
      const userId = story.userId || story.name;
      const storyId = story.id;
      const isFollowed = followedUsers.has(userId);
      const isLiked = likedStories.has(storyId);

      return (
        <div key={slideData.id} className="keen-slider__slide" style={slideStyles}>
          <div className="shorts-container">
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

            {/* Action Sidebar */}
            <div className="action-sidebar">
              <button
                className={`action-btn ${isLiked ? "active like-btn" : ""}`}
                onClick={(e) => handleLike(storyId, e)}
                title="Like"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'none', // Remove transition for instant response
                }}
              >
                <ThumbsUp size={24} />
              </button>
              <div className="action-count">{(story?.likes || 0) + (isLiked ? 1 : 0)}</div>

              <button className="action-btn" title="Comment">
                <MessageCircle size={24} />
              </button>
              <div className="action-count">{story?.comments || 0}</div>

              <button className="action-btn" title="Share">
                <Share size={24} />
              </button>
              <div className="action-count">{story?.shares || 0}</div>
            </div>

            {/* Video Information */}
            <div className="video-info py-5">
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
                  className={`follow-btn ${isFollowed ? "following" : ""}`}
                  onClick={(e) => handleFollow(userId, e)}
                  style={{
                    cursor: 'pointer',
                    transition: 'none', // Remove transition for instant response
                    transform: 'none', // Prevent any transform animations
                  }}
                >
                  {isFollowed ? "Following" : "Follow"}
                </button>
              </div>

              <div className="video-title">
                <Music /> Playing Music
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }, [followedUsers, likedStories, handleFollow, handleLike, navigate]);

  if (!allSlides.length) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={sliderRef} className="keen-slider" style={sliderStyles}>
      {allSlides.map((slideData, index) => renderSlide(slideData, index))}
    </div>
  );
};

export default Test;