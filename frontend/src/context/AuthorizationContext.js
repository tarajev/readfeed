import React from "react";

const AuthorizationContext = React.createContext({
    APIUrl: "http://localhost:5000/",
    contextUser: {
        username: "",
        role: "Guest",
        jwtToken: "",
        email: "",
        subscribedCategories: [],
    },
    contextSetUser: () => { },
});

export default AuthorizationContext;
