// Container koji je zaduzen za prikaz NotificationCard na odredjenoj poziciji + da ih "stack"-uje

import { useNotification } from '../context/NotificationContext.js';
import NotificationCard from './NotificationCard';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="transform transition-all duration-500 ease-out animate-slide-in-left"
          onClick={() => removeNotification(notification.id)}
        >
          <NotificationCard
            author={notification.author}
            category={notification.category}
            content={notification.content}
            title={notification.title}
            tags={notification.tags}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;