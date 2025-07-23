import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthorizationContext from './context/AuthorizationContext';
import './App.css';
import MainPage from "./views/MainPage"
import NotFound from './views/NotFound';
import AuthorPage from './views/AuthorPage';
import ArticlePage from "./views/ArticlePage";
import CreateArticle from "./views/CreateArticle";
import NotificationContainer from './components/NotificationContainer';
import { NotificationProvider } from './context/NotificationContext';
import CategorySelectionPage from './views/CategorySelection';

function AppRoutes() {
  const { contextUser } = useContext(AuthorizationContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      contextUser.role !== "Guest" &&
      Array.isArray(contextUser.subscribedCategories) &&
      contextUser.subscribedCategories.length < 3
    ) {
      if (window.location.pathname !== "/category-selection") {
        navigate("/category-selection");
      }
    }
  }, [contextUser, navigate]);

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/category-selection" element={<CategorySelectionPage />} />
      <Route path="/articlepage/:title/:id/:author" element={<ArticlePage />} />
      <Route path="/createarticle" element={<CreateArticle />} />
      <Route path="/author/:id" element={<AuthorPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  const [contextUser, contextSetUser] = useState({
    username: "",
    role: "Guest",
    jwtToken: "",
    email: "",
    picture: "",
    bio: "",
    subscribedCategories: [],
  });

  const APIUrl = "http://localhost:5000/";
  const value = { APIUrl, contextUser, contextSetUser };

  var storageUser = localStorage.getItem("ReadfeedUser");
  if (contextUser.role === "Guest" && storageUser) {
    var storageUserJson = JSON.parse(storageUser);
    contextSetUser(storageUserJson);
  }

  return (
    <AuthorizationContext.Provider value={value}>
      <NotificationProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <NotificationContainer />
      </NotificationProvider>
    </AuthorizationContext.Provider>
  );
}