import { useContext, useEffect, useRef, useState } from 'react'
import { Link as Goto, useLocation } from "react-router-dom";
import Header from './Header'
import Footer from './Footer'
import exitIconBlack from '../resources/img/exit-icon-black.png'
import eye from '../resources/img/password-eye.png'
import eyeSlashed from '../resources/img/password-eye-slashed.png'
import '../assets/colors.css'
import '../assets/animations.css'
import '../assets/App.css'

import { styled } from '@mui/material/styles';
import { default as MUIButton } from '@mui/material/Button';
import { CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DrawLoadingScreen from '../views/LoadingScreen';
import AuthorizationContext from '../context/AuthorizationContext';

export function Page({ overlayActive, overlayHandler, children, slidingPanel, loading = false, timeout = 500 }) {
  const [pageLoading, setPageLoading] = useState(loading);
  const { contextUser, contextSetUser } = useContext(AuthorizationContext);
  const location = useLocation();
  const prevLocation = useRef('');

  function PreloadHandler() { // Handler da se animacije ne puste na page load
    useEffect(() => {
      if (pageLoading) {
        setTimeout(() => {
          document.body.classList.add("preload");
        }, timeout + 100);
      }
      else if (prevLocation.current.pathname !== location.pathname) {
        document.body.classList.add("preload");
      }

      setTimeout(() => {
        document.body.classList.remove("preload");
      }, timeout + 300);

      prevLocation.current = location;
    }, []);

    return null;
  }

  useEffect(() => {
    const delayedLoading = setTimeout(() => {
      setPageLoading(false);
      return () => clearTimeout(delayedLoading);
    }, timeout);
  }, [])

  // TODO - Da se uradi za check context usera da li je ulogovan vec bio ili ne?

  const showHeader = location.pathname !== "/category-selection";

  return (
    <>
      <DrawLoadingScreen loading={pageLoading} />
      <PreloadHandler />
      <div className='bg-[#F4F1EC] min-h-screen'>
        {showHeader && <Header overlayActive={overlayActive} overlayHandler={overlayHandler} />}
        <div className="py-12  shadow-lg h-fit mx-auto max-w-3xl lg:max-w-6xl xl:max-w-7xl " style={{ minHeight: `calc(100vh - 150px)` }}>
          {children}
        </div>
        {slidingPanel}
        <Footer />
      </div>
    </>
  );
}

export function Button({ type, onClick, disabled, preventTab, className, children }) {
  return (
    <button
      type={type}
      disabled={disabled}
      tabIndex={preventTab ? -1 : 0}
      className={` bg-accent text-sm text-white text-center rounded-md ${!disabled ? "hover:bg-[#a9222f]" : "!bg-gray-400 opacity-80 cursor-not-allowed"} outline-none shadow-md w-fit ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function FileUpload({ className, width, height, text, buttonText, setPicture, limitInMegabytes = 1, filenameHidden }) {
  const [fileName, setFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    textTransform: 'lowercase',
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size < limitInMegabytes * 1000000) {
      if (!filenameHidden) {
        setFileName(file.name);
      }

      setPicture(file);
      setErrorMessage('');
      console.log(file);
    }
    if (file.size >= limitInMegabytes * 1000000) {
      setErrorMessage(`File is too big! Limit is ${limitInMegabytes}MB.`);
      console.error(file);
    }
  };

  return (
    <>
      <div className='hidden sm:flex items-baseline'>
        <p className='sm:mt-4 mr-1'>{text}</p>
        <p className='truncate mx-auto'>{fileName ? fileName : ""}</p>
      </div>
      <div className={className}>
        <MUIButton
          style={{ height: height, width: width, backgroundColor: "#a9222f", fontWeight: "600" }}
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          {buttonText}
          <VisuallyHiddenInput type="file" accept='image/png, image/jpeg' onChange={handleFileChange} />
        </MUIButton>
      </div>
      <div className="flex justify-center mt-2 sm:hidden">
        <p className='truncate mx-auto'>{fileName ? `Slika: ${fileName}` : ""}</p>
      </div>
      {errorMessage.length > 0 && <p className='text-red-600'>{errorMessage}</p>}
    </>
  );
}

export function SelectableButton({ onClick, selected, preventTab, className, children }) {
  return (
    <button
      tabIndex={preventTab ? -1 : 0}
      className={`rounded-xl focus:ring ring-violet-900 outline-none shadow-md w-fit ${selected ? "color-button-sel" : "color-button-unsel"} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function FormButton({ text, disabled, onClick, loading, className }) {
  return (
    <div className="mt-6">
      <button
        type="submit"
        disabled={disabled}
        onClick={onClick}
        className={`w-full px-4 py-2 text-sm text-white text-center bg-accent rounded-md ${!disabled ? "hover:bg-[#a9222f]" : "!bg-gray-400 opacity-80 cursor-not-allowed"} ${className}`}
      >
        <div className='flex items-center justify-center text-md font-medium'>
          {loading && <CircularProgress size={15} className='mr-2' sx={{ 'color': 'white' }} />}{text}
        </div>
      </button>
    </div>
  );
}

export function Link({ route, disabled, href, onClick, preventTab, className, children, param }) {
  return (
    <Goto
      to={param ? `${route}${param}` : route}
      href={href}
      disabled={disabled}
      tabIndex={preventTab || disabled ? -1 : 0}
      onClick={disabled ? null : onClick}
      className={`${disabled ? "text-gray-600 cursor-default" : "text-gray-400 cursor-pointer hover:underline"} outline-none ${className}`}
    >
      {children}
    </Goto>
  );
}

export function Checkbox({ value, className, required, preventTab, children, onChange }) {
  return (
    <label className={`inline-flex items-center ${className}`}>
      <input
        type="checkbox"
        value={value}
        tabIndex={preventTab ? -1 : 0}
        onChange={onChange}
        className="focus:ring-2 ring-gray-600 accent-gray-600 outline-none hover:ring-2"
      />
      <span className="block ml-2 text-sm text-gray-400">
        {children}
      </span>
      <span className="text-md text-red-600">
        {required ? "*" : ""}
      </span>
    </label>
  );
}

export function Exit({ preventTab, centered, disabled, notFocusable, className, onClick }) {
  return (
    // Na zalost <a> mora da bi bilo clickable sa Tab-Enter
    <div className={`w-fit ${centered ? "m-auto" : "ml-auto"}`}>
      <a
        href="#"
        onClick={onClick}
        tabIndex={preventTab ? -1 : 0}
        className={`${disabled ? "cursor-default" : ""} ${notFocusable ? "" : "outline-transparent"}`}
      >
        <img
          tabIndex={-1}
          className={`h-auto outline-none ${className}`}
          src={exitIconBlack}
        />
      </a>
    </div>
  );
}

export function Input({ placeholder, value, preventTab, date, minDate, maxDate, multiline, disabled, rows, onFocus, onBlur, onChange, onKeyDown, className }) {
  return (
    multiline ? (
      <textarea
        spellCheck={false}
        rows={rows}
        value={value}
        disabled={disabled}
        tabIndex={preventTab ? -1 : 0}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={`relative h-fit z-10 w-full px-3 py-2 pr-10 shadow-md focus:ring outline-none ring-gray-600 border-1 border-gray-600 ${className} ${disabled ? 'opacity-50' : ''}`}
      />
    ) : (
      <input
        type={date ? "date" : "search"}
        min={minDate}
        max={maxDate}
        disabled={disabled}
        spellCheck={false}
        value={value}
        tabIndex={preventTab ? -1 : 0}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={`relative z-10 w-full p-1 pr-5 shadow-md h-12 text-[#07090D] outline-none ${className} ${disabled ? 'opacity-50' : ''}`}
      />
    )
  );
}

export function FormInput({ text, textClass, labelClass, date, minDate, maxDate, required, multiline, rows, inline, value, type, onChange, onBlur, onKeyDown, pattern, className, alertCond, alertText, disabled }) {
  return (
    <label className={`block ${inline ? "flex flex-nowrap items-center" : ""}`}>
      <div className={`${inline ? "mr-2" : ""} ${labelClass}`}>
        <span className={`text-md font-medium text-gray-900 ${textClass}`}>
          {text}
        </span>
        <span className="text-md text-red-600">
          {required ? "*" : ""}
        </span>
      </div>
      {multiline ? (
        <textarea
          type={date ? "date" : type}
          rows={rows}
          value={value}
          min={minDate}
          max={maxDate}
          spellCheck={false}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          pattern={pattern}
          className={`block w-full mt-1 rounded-md text-gray-900 font-medium bg-secondary border border-gray-800 p-2 focus:ring ${alertCond ? "ring ring-accent" : "ring-secondary"} ${className}`}
        />
      ) : (
        <input
          type={date ? "date" : type}
          value={value}
          min={minDate}
          max={maxDate}
          spellCheck={false}
          onChange={onChange}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          disabled={disabled}
          pattern={pattern}
          className={`block w-full mt-1 rounded-md text-gray-900 font-medium bg-secondary border border-gray-800 p-2 ${alertCond ? "ring ring-accent" : ""} ${className}`}
        />
      )}
      {alertCond && <p className="text-accent text-xs mt-1">{alertText}</p>}
    </label>
  );
}

export function Password({ text, textClass, labelClass, required, visibility, inline, value, onChange, onBlur, className, alertCond, alertText }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <label className={`block mt-3 ${inline ? "flex flex-nowrap items-center" : ""}`}>
      <div className={`${inline ? "mr-2" : ""} ${labelClass}`}>
        <span className={`text-md text-gray-800 ${textClass}`}>
          {text}
        </span>
        <span className="text-md text-red-600">
          {required ? "*" : ""}
        </span>
      </div>
      <div className="relative w-full">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          spellCheck={false}
          onChange={onChange}
          onBlur={onBlur}
          className={`block w-full pr-8 mt-1 rounded-md text-black bg-gray-700 border border-gray-800 p-2 outline-none ${alertCond ? "ring ring-accent" : ""} ${className}`}
        />
        <img
          src={visibility ? (showPassword ? eyeSlashed : eye) : ""}
          className={`absolute ${inline ? "mt-1.5" : "mt-1"} top-2 right-2 cursor-pointer w-5 h-auto filter-gray`}
          onClick={togglePasswordVisibility}
        />
        {alertCond && <p className="text-accent text-xs mt-1">{alertText}</p>}
      </div>
    </label>
  );
}

export function EditableInput({ initialValue, preventTab, label, setValue }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(initialValue);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (setValue && newValue !== initialValue) {
      setValue(newValue);
    }
  };

  const handleKeyEnter = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
  };

  useEffect(() => {
    setNewValue(initialValue);
  }, [isEditing])

  return (
    <div className="mb-2">
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <Input multiline rows={3} value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={handleKeyEnter}
            onBlur={handleSave}
            preventTab={preventTab}
            className="bg-gray-100 text-black border border-gray-400 resize-none"
          />
        </div>
      ) : (
        <div className="flex justify-between">
          <span className="block mb-1">{label}</span>
          <button onClick={handleEditClick} tabIndex={preventTab ? -1 : 0} className="text-sm underline hover:opacity-80 ml-4">
            Edit
          </button>
        </div>
      )}
    </div>
  );
}

export function GetMonthName(monthNumber) {
  const months = ["Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"];
  return months[monthNumber];
}
