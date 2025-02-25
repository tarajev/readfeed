import MainPage from "./views/MainPage"
import AuthorizationContext from './context/AuthorizationContext';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from 'react';
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

  var storageUser = localStorage.getItem('NeowatchUser');

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
          </Routes>
        </BrowserRouter>
      </AuthorizationContext.Provider>
    </div>
  );
}

export default App;
