import React, { useState, useContext } from "react";
import logo from '../resources/img/neowatchlogo.png';
import { Input, Link } from '../components/BasicComponents';
import { DrawLogin, DrawRegistration } from "../views/LoginRegistration";
import iconBurger from "../resources/img/burger-menu.png"
import searchIcon from "../resources/img/icon-search.png"
import BurgerMenu from "./BurgerMenu";
import AuthorizationContext from "../context/AuthorizationContext";
import '../assets/colors.css'
import '../assets/App.css'

export default function Header({ overlayActive, overlayHandler }) {
  const { contextUser, contextSetUser } = useContext(AuthorizationContext);
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [search, setSearch] = useState("");

  const toggleRegistration = () => {
    setShowRegistration(!showRegistration);
  };

  const exitRegistration = () => {
    setShowRegistration(false);
  }

  const handleLoginClick = () => {
    setShowLogin(!showLogin);
    if (overlayHandler != null)
      overlayHandler(!showLogin);
  };

  const handleLogout = () => {
    contextSetUser({
      username: "",
      role: "Guest",
      jwtToken: "",
      email: "",
      picture: null,
      bio: ""
    })
    localStorage.clear();
    sessionStorage.clear();
  }

  const handleKeyDown = async (e) => {
    if (e.key == "Enter")
      searchNewsArticles();
  }

  const searchNewsArticles = () => {

  }

  // TODO - BurgerMenu itemList da se uradi
  // TODO - contextUser da se uradi dinamicki Header

  return (
    <div className={`pt-16 sticky top-0 z-50`}>
      {showLogin && <div className="overlay" onClick={handleLoginClick}></div>}
      {showLogin && <DrawLoginForm showRegistration={showRegistration} exitRegistration={exitRegistration} toggleRegistration={toggleRegistration} handleLoginClick={handleLoginClick} />}
      <nav className="absolute shadow-xl top-0 left-0 w-full border-b bg-[#F4F1EC] md:flex-row md:flex-nowrap md:justify-start flex items-center p-8">
        <div className="w-full mx-auto items-center flex justify-between  md:flex-nowrap flex-wrap md:px-10 px-2">
          <div className="relative flex hidden lg:block pr-4"> {/*Search postaje deo BurgerMenu za manje ekrane */}
            <img //da li ostaviti?
              src={searchIcon}
              alt="SearchIcon"
              className="absolute inset-y-0 left-3 w-4 h-4 my-auto z-40"
            />
            <Input
              placeholder='Search'
              value={search}
              className="rounded-xl pl-8 bg-[#ECE9E4] md:w-80 h-10 z-20"
              onChange={(e) => { setSearch(e.target.value) }}
              onKeyDown={handleKeyDown}
            /></div>
          <h1 className="absolute left-1/2 transform -translate-x-1/2 block font-playfair sm:text-3xl font-semibold text-[#07090D] justify-self-center self-center mx-auto">readfeed.</h1>
          <span className="block lg:hidden">
            <BurgerMenu preventTab={overlayActive} icon={iconBurger} listItemArray={null} grouped size={10} />
          </span>
          <span className="hidden sm:flex items-center mr-1 py-1 max-w-405">
            {contextUser.role == "Guest" ? (
              <>
                <Link className='mx-2 !text-gray-400' preventTab={overlayActive} onClick={handleLoginClick}>
                  Log in
                </Link>
              </>) : (<>
                <Link className='mx-2 !text-gray-400' preventTab={overlayActive} onClick={handleLogout}>
                  Log out
                </Link>
              </>)
            }
          </span>
        </div>
      </nav>
    </div>
  );
}


function DrawLoginForm({ showRegistration, exitRegistration, toggleRegistration, handleLoginClick }) {
  return (
    <>
      {showRegistration ? (
        <DrawRegistration onLoginClick={toggleRegistration} exitRegistration={exitRegistration} handleLoginClick={handleLoginClick} />
      ) : (
        <DrawLogin onRegisterClick={toggleRegistration} handleLoginClick={handleLoginClick} />
      )}
    </>
  );
}
  