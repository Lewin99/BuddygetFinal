import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../Hooks/useAuth";

const NotificationComponent: React.FC = () => {
  const { auth } = useAuth();
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    if (auth.accessToken) {
      const ws = new WebSocket(
        `ws://localhost:5000/?token=${auth.accessToken}`
      );

      ws.onopen = () => {
        console.log("WebSocket connection established");
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setNotifications((prev) => [...prev, data.message]);
        toast.info(data.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };

      return () => {
        ws.close();
      };
    }
  }, [auth.accessToken]);

  return (
    <>
      <ToastContainer />
      <div>
        <h2>Notifications</h2>
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>{notification}</li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default NotificationComponent;
