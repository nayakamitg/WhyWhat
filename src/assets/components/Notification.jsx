import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../services/slices/userSlice";
import { Alert } from "react-bootstrap";
import { MoreVertical } from "lucide-react";
import "../style/notification.css"
import ThemeContext from "../services/ThemeContext";

const Notification = () => {
  const { userData, loggedIn } = useSelector((state) => state.user);
  const {mode}=useContext(ThemeContext)
  const [noti, setNoti] = useState([
    {
      notificationId: -1,
      userId: 3,
      senderId: null,
      message: "Pleare login to see your notifications and activity",
      targetType: "Question",
      targetId: 3,
      isRead: false,
      createdAt: "2024-05-03T18:00:00",
    },
  ]);
  const dispatch = useDispatch();

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

  useEffect(() => {}, []);

  const getUserNotification = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/Notifications/user/3`
      );
      console.log("noti", res.data);
    setNoti(res.data)
    } catch (e) {
      console.log("notification error", e);
    }
  };

  useEffect(() => {
    getUserNotification();
  }, []);

  return (
    <div className="pt-4">
      {noti.map((notif, index) => (
        <div className="notification-container">
        <div className={`notification-wrapper ${mode=="dark"?"text-light":"text-dark"}`}>
          {/* Channel Avatar */}
          <div className="avatar-section">
          </div>
            <div className="channel-avatar"><img src={notif.avatar||"/profile.webp"} alt="" style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"
            }}/></div>

          {/* Main Content */}
          <div className="content-section">
            <div className="content-wrapper">
              <div className="text-content">
                <p className="channel-name">
                  <span className="fw-bold">{notif?.handle||"@handle"}</span>
                </p>
                <p className="video-title">
                  {
                    notif.message
                  }
                </p>
                <p className="timestamp">{timeAgo(notif.createdAt)}</p>
              </div>

              {/* Thumbnail */}
              <div className="thumbnail-section">
                <div className="video-thumbnail">
                  <img
                    src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=100&h=100&fit=crop"
                    alt="Video thumbnail"
                    className="thumbnail-img"
                  />
                  {/* <div className="duration-overlay">14:32</div> */}
                </div>
              </div>
            </div>
          </div>

          {/* More Options */}
          <div className="options-section">
            <button className="more-options-btn">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      </div>
        // <Alert key={index} variant="primary" className="mx-2">
        //   {notif.message}.{notif.notificationId==-1?<Alert.Link href="/login">Click here</Alert.Link>:<Alert.Link href={notif.targetType=="Question"?`/question/${notif.targetId}`:""}>Click here</Alert.Link>}
        // </Alert>
      ))}
    </div>
  );
};

export default Notification;




export function timeAgo(date) {
  const now = new Date();
  const created = new Date(date);
  const diff = (now - created) / 1000; // in seconds

  const seconds = Math.floor(diff);
  const minutes = Math.floor(diff / 60);
  const hours = Math.floor(diff / 3600);
  const days = Math.floor(diff / 86400);
  const weeks = Math.floor(diff / 604800);
  const months = Math.floor(diff / 2592000); // 30 days
  const years = Math.floor(diff / 31536000); // 365 days

  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (weeks > 0) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
}
