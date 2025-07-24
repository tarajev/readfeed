import { createContext, useContext, useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import AuthorizationContext from './AuthorizationContext';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [connection, setConnection] = useState(null);
  const { contextUser } = useContext(AuthorizationContext);

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/newsHub')
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    newConnection
      .start()
      .then(() => {
        console.log('SignalR Connected');

        newConnection.on('ReceiveNewsArticle', (article) => {
          if (
            contextUser?.subscribedCategories?.includes(article.category)
          ) {
            addNotification(article);
          } else {
            console.log(
              `Skipped notification for category '${article.category}' not in subscribedCategories`
            );
          }
        });
      })
      .catch((err) => console.error('SignalR Connection Error: ', err));

    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, [contextUser]);

  const addNotification = (article) => {
    const id = Date.now() + Math.random();
    const notification = {
      ...article,
      id,
    };

    setNotifications((prev) => [...prev, notification]);

    setTimeout(() => {
      removeNotification(id);
    }, 7000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        connection,
        isConnected: connection?.state === signalR.HubConnectionState.Connected,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
