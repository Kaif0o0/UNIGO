import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, X } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const NotificationToast = () => {
  const { notifications, dismissNotification } = useNotifications();
  const navigate = useNavigate();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-4 z-[999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className="pointer-events-auto bg-unigo-black text-white rounded-[24px] shadow-2xl p-4 flex items-start gap-4 cursor-pointer
                     animate-in slide-in-from-right-4 fade-in duration-300"
          onClick={() => {
            dismissNotification(notif.id);
            navigate(`/chat/${notif.chatId}`, { state: { chat: notif.chatState } });
          }}
        >
          {/* Icon */}
          <div className="w-10 h-10 bg-unigo-green rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
            <MessageSquare className="w-5 h-5 text-unigo-black" />
          </div>

          {/* Content */}
          <div className="flex-grow min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-unigo-green">
                New Message
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dismissNotification(notif.id);
                }}
                className="text-white/30 hover:text-white transition-colors ml-2"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-sm font-black uppercase tracking-tight truncate">
              {notif.senderName}
            </p>
            <p className="text-xs text-white/50 font-medium truncate mt-0.5">
              {notif.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
