import { createContext, useContext, useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';

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

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/newsHub')
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    newConnection.start()
      .then(() => {
        console.log('SignalR Connected');

        newConnection.on('ReceiveNewsArticle', (article) => {
          addNotification(article);
        });
      })
      .catch(err => console.error('SignalR Connection Error: ', err));

    // Dispose
    return () => {
      if (newConnection) {
        newConnection.stop();
      }
    };
  }, []);

  const addNotification = (article) => {
    const id = Date.now() + Math.random();
    const notification = {
      ...article,
      id,
      author: article.author,
      category: article.category,
      title: article.title,
      content: article.content,
      tags: article.tags,
      createdAt: article.createdAt,
    };

    setNotifications(prev => [...prev, notification]);

    // Pomeri se nakon 7 sekundi
    setTimeout(() => {
      removeNotification(id);
    }, 7000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      connection,
      isConnected: connection?.state === signalR.HubConnectionState.Connected
    }}>
      {children}
    </NotificationContext.Provider>
  );
};