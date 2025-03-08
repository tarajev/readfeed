import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthorizationContext from './context/AuthorizationContext';
import './App.css';
import MainPage from "./views/MainPage"
import NotFound from './views/NotFound';
import AuthorPage from './views/AuthorPage';
import ArticlePage from "./views/ArticlePage";

function App() {
  const [contextUser, contextSetUser] = useState({
    username: "",
    role: "Guest",
    jwtToken: "",
    email: "",
    picture: "",
    bio: "",
  });

  const APIUrl = "http://localhost:5000/";
  const value = { APIUrl, contextUser, contextSetUser };

  var storageUser = localStorage.getItem('ReadfeedUser');
  if (contextUser.role == "Guest"  && storageUser) { //ako se osvezi stranica
    var storageUserJson = JSON.parse(storageUser);
    contextSetUser(storageUserJson);
  }

  return (
    <div>
      <AuthorizationContext.Provider value={value}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/articlepage/:title" element={<ArticlePage/>}></Route>
            <Route path="/author/:id" element={<AuthorPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthorizationContext.Provider>
    </div>
  );
}

export default App;
