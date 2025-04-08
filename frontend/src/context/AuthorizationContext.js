import React from "react";

// TODO - Da se odradi context kako treba

const AuthorizationContext = React.createContext({
    APIUrl: "http://localhost:5000/",
    contextUser: {
        username: "",
        role: "Guest",
        jwtToken: "",
        email: "",
    },
    contextSetUser: () => { },
});

export default AuthorizationContext;
