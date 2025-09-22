import { CirclePlus, Compass, Heart, Plus, Youtube } from "lucide-react";
import React, { useEffect, useRef, useState, useLayoutEffect, useContext } from "react";
import { User, Eye, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostsStart, fetchPostsSuccess } from "../services/slices/postSlice";
import { Dropdown } from "react-bootstrap";
import { RiShareForwardLine } from "react-icons/ri";
import { CiFlag1 } from "react-icons/ci";
import { FaRegFlag } from "react-icons/fa6";
import ThemeContext from "../services/ThemeContext";

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

const getRandomGradient = () => {
  return gradientClasses[Math.floor(Math.random() * gradientClasses.length)];
};

const Home = () => {
  const {mode,setMode}=useContext(ThemeContext)
  console.log("home mode",mode)
  return (
    <div>
      <BootstrapFeed mode={mode} />
    </div>
  );
};

export default Home;

const BootstrapFeed = ({mode}) => {
  const {posts}=useSelector((state)=>state.post)
  const dispatch=useDispatch()

  useEffect(()=>{
    if(posts.length<=0){
    dispatch(fetchPostsStart())
    dispatch(fetchPostsSuccess())
    }
  },[dispatch])


  return (
    <>
     <div className={`container-fluid d-flex justify-content-start overflow-auto smallNavBar gap-1 ${mode === "light" ? "bg-light text-dark" : "bg-dark text-light"}`}>
<div className="box border border-1 rounded-1 my-1 mx-2" style={{padding:"1px 7px 5px 7px"}}><Compass size={20}/></div>
<div className="box border border-1 px-3 rounded-1 m-1 fw-semibold">All</div>
<div className="box border border-1 px-3 rounded-1 m-1 fw-semibold">Spritual</div>
<div className="box border border-1 px-3 rounded-1 m-1 fw-semibold">Science</div>
<div className="box border border-1 px-3 rounded-1 m-1 fw-semibold">Education</div>
<div className="box border border-1 px-3 rounded-1 m-1 fw-semibold">Technology</div>
<div className="box border border-1 px-3 rounded-1 m-1 fw-semibold">AI</div>
<div className="box border border-1 px-3 rounded-1 m-1 fw-semibold">Business</div>

        </div>


      <div className="feed-container bg-transparent container-fluid p-0 pt-5">
        {posts.map((post) => (
          <div key={post.id} className="post-card mb-4 bg-transparent">
            {/* Post Header */}
            <div className="d-flex align-items-center p-3 border-bottom bg-transparent">
              <div className="position-relative avatar-pic">
                <img
                  src={post.avatar}
                  onError={(e) => (e.target.src = "/profile.webp")}
                  className="avatar rounded-circle"
                />
              </div>
              <div className="flex-grow-1 d-flex flex-column justify-content-center">
                <div className="post-description mb-0 d-flex justify-content-between align-items-center">
                 {post.description}
                </div>
                <small className=" fw-bold">@{post.name}</small>
              </div>
              <div className="d-flex flex-column justify-content-center">
               
                <Dropdown>
                  <Dropdown.Toggle as="button" className="border-0 bg-transparent">
                    <MoreVertical color={mode==="light"?"black":"white"} size={20} />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className='position-absolute language'>
                    <Dropdown.Item><Heart size={17} className="mx-1" style={{marginTop:"-4px"}}/> Mark as favorite</Dropdown.Item>
                    <Dropdown.Item><RiShareForwardLine size={20} className="mx-1"/> Share</Dropdown.Item>
                    <Dropdown.Item><FaRegFlag size={17} className="mx-1"/> Report</Dropdown.Item>
                   
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>

            {/* Post Description */}
            <div className="px-3 py-3"></div>

            {/* Horizontal Scrolling Stories */}
            <div className="pb-3">
              <div className="story-container d-flex gap-3 px-3">
                {post.stories.map((story) => (
                  <SingleCard post={post} story={story} />
                ))}
                <ReplyCard postId={post?.id} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const ExpandableText = ({ text, lines = 2 }) => {
  const ref = useRef(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [clampActive, setClampActive] = useState(true); // controls -webkit-line-clamp
  const [collapsedH, setCollapsedH] = useState(0);
  const [fullH, setFullH] = useState(0);
  const [showToggle, setShowToggle] = useState(false);

  // measure heights whenever text changes
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // temporarily remove class that clamps so we can measure full height correctly
    const hadClamp = el.classList.contains("clamped");
    if (hadClamp) el.classList.remove("clamped");

    // force reflow and measure full height:
    const full = el.scrollHeight;

    // compute a reliable line-height:
    const cs = window.getComputedStyle(el);
    let lineHeight = parseFloat(cs.lineHeight);
    if (Number.isNaN(lineHeight)) {
      // fallback: measure a temporary off-screen element with same font
      const temp = document.createElement("div");
      temp.style.position = "absolute";
      temp.style.visibility = "hidden";
      temp.style.whiteSpace = "nowrap";
      temp.style.font = cs.font; // copy font shorthand
      temp.innerText = "A";
      document.body.appendChild(temp);
      lineHeight = temp.getBoundingClientRect().height || 16;
      document.body.removeChild(temp);
    }

    const collapsed = Math.ceil(lineHeight * lines);

    // restore clamp class state
    if (hadClamp) el.classList.add("clamped");

    setFullH(full);
    setCollapsedH(collapsed);
    setShowToggle(full > collapsed + 1); // show toggle only if content taller than collapsed
    setClampActive(!isExpanded); // keep clamp active when collapsed
  }, [text, lines, isExpanded]);

  const maxHeight = isExpanded ? `${fullH}px` : `${collapsedH}px`;

  const onToggle = () => {
    // EXPAND:
    if (!isExpanded) {
      // remove clamp first so element can grow during animation
      setClampActive(false);
      // next animation frame set expanded so max-height animates to fullH
      requestAnimationFrame(() => setIsExpanded(true));
    } else {
      // COLLAPSE:
      // set maxHeight to collapsedH (will animate). We keep clamp off during animation
      setIsExpanded(false);
      // when transition ends we will enable the clamp in onTransitionEnd
    }
  };

  function handleTransitionEnd(e) {
    // only run on max-height transitions
    if (e.propertyName !== "max-height") return;
    if (!isExpanded) {
      // finished collapsing -> turn clamp on to show ellipsis
      setClampActive(true);
    } else {
      // finished expanding -> optionally keep clamp off (already off)
      // If you want the container to be fully flexible after expand (no fixed maxHeight),
      // you could set inline style maxHeight to 'none' here. But using px is stable.
    }
  }

  return (
    <div className="expandable-text-wrapper px-2">
      <div
        ref={ref}
        className={`expandable-text ${clampActive ? "clamped" : ""}`}
        style={{ maxHeight }}
        onTransitionEnd={handleTransitionEnd}
        aria-expanded={isExpanded}
      >
        <div className="expandable-text-inner">{text}</div>
      </div>

      {showToggle && (
        <button
          className="btn btn-link p-0 mt-2 expand-toggle"
          style={{ fontSize: "14px" }}
          onClick={onToggle}
          aria-label={isExpanded ? "Show less" : "Show more"}
        >
          {isExpanded ? "Show Less" : "Show More"}
          <span className={`chev ${isExpanded ? "open" : ""}`} aria-hidden>
            ▾
          </span>
        </button>
      )}
    </div>
  );
};

export const SingleCard = ({ post, story }) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        key={story.id}
        className={`story-card ${
          story.gradient || getRandomGradient()
        } text-decoration-none`}
        onClick={() => navigate(`/detail/${[post.id, story.id].join(",")}`)}
      >
        <div className="d-flex flex-column h-100 story-card-main">
          {/* Story Header */}

          <p className="text-center Answer">{story.answer}</p>

          {/* Story Footer - Only Views */}
          <div className="story-footer">
            <div className="story-views">
              <Eye size={16} className="me-2" />
              {story.views}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ReplyCard = ({ postId }) => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className={`story-card flex flex-column align-items-center justify-content-center gradient-21`}
        onClick={() => navigate(`/reply/${postId}`)}
      >
        <div className=" story-card-main ">
          <p className="d-flex justify-content-center align-items-center text-center Answer fs-5">
            Post Your Answer
          </p>
        </div>
        <p className="w-100 text-center">
          <CirclePlus size={50} />
        </p>
      </div>
    </>
  );
};
