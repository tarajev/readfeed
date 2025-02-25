import { useState } from "react";
import exitIcon from "../resources/img/exit-icon-black.png"

export default function Tag({text, onClick, displayOnly}) {

  return (
    <div className=" flex w-fit h-fit px-2 py-1 mr-2 mb-2 text-bold rounded-lg bg-[#ECE9E4] hover:bg-white pointer-events-none"> {`${text}`} 
    {displayOnly ? (<></>) : <img className = "w-4 h-4 my-auto ml-2 hover:cursor-pointer group pointer-events-auto" src= {exitIcon} onClick={onClick}></img>}
    </div>
  );
}
