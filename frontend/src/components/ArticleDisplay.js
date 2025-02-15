import { useState } from "react";
import exitIcon from "../resources/img/exit-icon-black.png"
import arrowUpIcon from "../resources/img/arrow-up-outline.png"
import arrowDownIcon from "../resources/img/arrow-down-outline.png"
import bookmarkIcon from "../resources/img/icon-bookmark-outline.png"
import arrowUpIconFilled from "../resources/img/arrow-up-filled.png"
import arrowDownIconFilled from "../resources/img/arrow-down-filled.png"
import bookmarkIconFilled from "../resources/img/icon-bookmark-filled.png"
import vienna from "../images/vienna.jpg"

export default function ArticleDisplay({ article, onClick }) {

    const [upvotedFilled, setUpvotedFilled] = useState(false);
    const [downvotedFilled, setDownvotedFilled] = useState(false);
    const [bookmarkedFilled, setBookmarkedFilled] = useState(false);

    return (
        <div className="grid w-[330px] p-5 hover:cursor-pointer bg-[#ECE9E4] shadow-xl rounded-md">
            <div className=" flex w-fit h-fit mb-2 text-bold rounded-lg hover:bg-white pointer-events-none">
                <img className="object-contain h-30" src={vienna} onClick={onClick}></img>
            </div>
            <div className="flex mb-2 md:text-lg">
                <span className="text-accent font-bold font-playfair">{article.category}</span>
                <span className="text-dark ml-auto opacity-80 font-playfair">{ (new Date(article.createdAt)).toLocaleDateString("en-GB")}</span>
            </div>
            <div className="flex mb-2">
                <span className="break-normal text-dark sm:text-md md:text-xl font-extrabold font-playfair">{article.title}</span>
            </div>
            <div className="flex gap-2 items-center">
                <span className="text-dark sm:text-md md:text-lg font-semibold opacity-80 font-playfair">{article.score}</span>
                <img className="w-4 h-4" src={upvotedFilled ? arrowUpIconFilled : arrowUpIcon} onClick={()=>{setUpvotedFilled(!upvotedFilled); setDownvotedFilled(false)}}></img>
                <img className="w-4 h-4" src={downvotedFilled? arrowDownIconFilled : arrowDownIcon} onClick={()=>{setDownvotedFilled(!downvotedFilled); setUpvotedFilled(false)}}></img>
                <img className=" ml-auto w-4 h-4" src={bookmarkedFilled? bookmarkIconFilled : bookmarkIcon} onClick={()=>{setBookmarkedFilled(!bookmarkedFilled)}}></img>
            </div>
        </div>
    );
}
