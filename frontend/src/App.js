import MainPage from "./views/MainPage"
import AuthorizationContext from './context/AuthorizationContext';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from 'react';

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
          </Routes>
        </BrowserRouter>
      </AuthorizationContext.Provider>
    </div>
  );
}

export default App;
