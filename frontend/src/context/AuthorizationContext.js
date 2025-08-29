import React from "react";

const AuthorizationContext = React.createContext({
    APIUrl: "http://localhost:5000/",
    contextUser: {
        username: "",
        role: "Guest",
        jwtToken: "",
        email: "",
        picture: "",
        bio: "",
        subscribedCategories: [],
    },
    contextSetUser: () => { },
});

export default AuthorizationContext;
