import { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  const [isConnected, setIsConnected] = useState(false);
  const connectionRef = useRef(null);
  const isConnectingRef = useRef(false);

  useEffect(() => {
    const connectSignalR = async () => {
      // Da ne moze vise puta da se konektuje (baca error)
      if (isConnectingRef.current || connectionRef.current) {
        return;
      }

      isConnectingRef.current = true;

      try {
        const newConnection = new signalR.HubConnectionBuilder()
          .withUrl('http://localhost:5000/newsHub')
          .withAutomaticReconnect()
          .build();
 
        newConnection.on('ReceiveNewsArticle', (article) => {
          addNotification(article);
        });

        await newConnection.start();
        
        connectionRef.current = newConnection;
        setConnection(newConnection);
        setIsConnected(true);
        console.log('SignalR Connected');

      } catch (error) {
        console.error('SignalR Connection Error:', error);
        setIsConnected(false);
      } finally {
        isConnectingRef.current = false;
      }
    };

    connectSignalR();

    // Dispose
    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
        setConnection(null);
        setIsConnected(false);
        isConnectingRef.current = false;
      }
    };
  }, []);

  const addNotification = (article) => {
    const id = Date.now() + Math.random();
    const notification = {
      ...article,
      id,
      author: article.authorName,
      category: article.category,
      title: article.title,
      content: article.content,
      tags: article.tags,
      createdAt: article.createdAt,
    };

    setNotifications(prev => [...prev, notification]);

    // Notifikacija da se pomeri za 7 sekundi
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
      isConnected
    }}>
      {children}
    </NotificationContext.Provider>
  );
};