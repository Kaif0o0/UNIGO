import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();
export const useNotifications = () => useContext(NotificationContext);

const POLL_INTERVAL = 5000;

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);

  // Use refs so the polling closure always reads the latest values
  // without needing to restart the interval on every navigation
  const seenLastMessages = useRef({});   // { chatId -> lastMessageId }
  const initialised = useRef(false);
  const userRef = useRef(user);
  const activeChatIdRef = useRef(null);

  // Keep refs in sync with current values
  useEffect(() => { userRef.current = user; }, [user]);

  useEffect(() => {
    const chatId = location.pathname.startsWith('/chat/')
      ? location.pathname.split('/chat/')[1]
      : null;
    activeChatIdRef.current = chatId;
  }, [location.pathname]);

  const dismissNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Start/stop polling based on whether user is logged in
  useEffect(() => {
    if (!user) {
      seenLastMessages.current = {};
      initialised.current = false;
      setNotifications([]);
      return;
    }

    const poll = async () => {
      const currentUser = userRef.current;
      if (!currentUser) return;

      try {
        const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
        const { data: chats } = await axios.get(`${import.meta.env.VITE_API_URL}/api/chats`, config);

        if (!initialised.current) {
          // Seed seen map on first load — prevents old messages triggering notifications
          chats.forEach((chat) => {
            if (chat.lastMessage) {
              seenLastMessages.current[chat._id] = chat.lastMessage._id.toString();
            } else {
              seenLastMessages.current[chat._id] = null;
            }
          });
          initialised.current = true;
          return;
        }

        chats.forEach((chat) => {
          const lastMsg = chat.lastMessage;

          // No message yet in this chat
          if (!lastMsg) return;

          const newMsgId = lastMsg._id.toString();
          const seenId = seenLastMessages.current[chat._id];
          const alreadySeen = seenId === newMsgId;
          if (alreadySeen) return;

          // Mark as seen regardless — so we don't re-notify later
          seenLastMessages.current[chat._id] = newMsgId;

          // Suppress if user is currently in this chat
          if (activeChatIdRef.current === chat._id) return;

          // Suppress if the message was sent by the current user
          const senderId = (lastMsg.sender?._id || lastMsg.sender)?.toString();
          const myId = currentUser._id?.toString();
          if (senderId === myId) return;

          // Resolve the sender's display name
          const other = chat.participants?.find(
            (p) => (p._id || p).toString() !== myId
          );
          const senderName = other?.name || chat.mentor?.name || 'Someone';

          const notifId = `${chat._id}-${newMsgId}`;

          // Avoid duplicate toasts
          setNotifications((prev) => {
            if (prev.some((n) => n.id === notifId)) return prev;
            return [
              ...prev,
              {
                id: notifId,
                chatId: chat._id,
                chatState: chat,
                senderName,
                message: lastMsg.text,
                time: lastMsg.createdAt,
              },
            ];
          });
        });
      } catch {
        // Silent failure — don't break the app if polling fails
      }
    };

    // Kick off immediately, then every 5 s
    poll();
    const interval = setInterval(poll, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [user]); // Only restart when user changes (login/logout)

  // Auto-dismiss each notification after 5 seconds
  useEffect(() => {
    if (notifications.length === 0) return;
    const latest = notifications[notifications.length - 1];
    const timer = setTimeout(() => dismissNotification(latest.id), 5000);
    return () => clearTimeout(timer);
  }, [notifications, dismissNotification]);

  return (
    <NotificationContext.Provider value={{ notifications, dismissNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
