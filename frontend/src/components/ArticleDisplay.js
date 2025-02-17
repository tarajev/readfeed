import { useState, useContext } from "react";
import axios from 'axios';
import AuthorizationContext from '../context/AuthorizationContext'
import exitIcon from "../resources/img/exit-icon-black.png"
import arrowUpIcon from "../resources/img/arrow-up-outline.png"
import arrowDownIcon from "../resources/img/arrow-down-outline.png"
import bookmarkIcon from "../resources/img/icon-bookmark-outline.png"
import arrowUpIconFilled from "../resources/img/arrow-up-filled.png"
import arrowDownIconFilled from "../resources/img/arrow-down-filled.png"
import bookmarkIconFilled from "../resources/img/icon-bookmark-filled.png"
import vienna from "../images/vienna.jpg"

export default function ArticleDisplay({ article, onClick }) {
    const { APIUrl, contextUser } = useContext(AuthorizationContext)
    const [upvotedFilled, setUpvotedFilled] = useState(false);
    const [downvotedFilled, setDownvotedFilled] = useState(false);
    const [bookmarkedFilled, setBookmarkedFilled] = useState(false);
    const [score, setScore] = useState(article.score);

    const addToReadLater = async () => {//treba da se prikaze u read later
        var route = `NewsArticle/AddToReadLater/${"username1"}/${article.id}`;
        await axios.post(APIUrl + route, {
            headers: {
                Authorization: `Bearer ${contextUser.jwtToken}`,
            }
        }).then(result => {
            console.log(result.data);
            setBookmarkedFilled(!bookmarkedFilled);
        }).catch(error => {
            console.log(error);
        });
    }

    const removeFromReadLater = async () => {
        var route = `NewsArticle/RemoveArticleFromReadLater/${"username1"}/${article.id}`;
        await axios.delete(APIUrl + route, {
            headers: {
                Authorization: `Bearer ${contextUser.jwtToken}`,
            }
        }).then(result => {
            console.log(result.data);
            setBookmarkedFilled(!bookmarkedFilled);
        }).catch(error => {
            console.log(error);
        });
    }

    const upvoteNewsArticle = async () => {
        var route = `NewsArticle/UpvoteNewsArticle/${"username1"}/${article.id}`;
        await axios.put(APIUrl + route, {
            headers: {
                Authorization: `Bearer ${contextUser.jwtToken}`,
            }
        }).then(result => {
            console.log(result.data);
            setScore(score => score + 1);
            setUpvotedFilled(!upvotedFilled);
        }).catch(error => {
            console.log(error);
        });
    }

    const downvoteNewsArticle = async () => {
        var route = `NewsArticle/DownvoteNewsArticle/${"username1"}/${article.id}`;
        await axios.put(APIUrl + route, {
            headers: {
                Authorization: `Bearer ${contextUser.jwtToken}`,
            }
        }).then(result => {
            console.log(result.data);
            setScore(score => score - 1);
            setDownvotedFilled(!downvotedFilled);
        }).catch(error => {
            console.log(error);
        });
    }

    const removeDownvote = async () => {
        var route = `NewsArticle/RemoveDownvoteNewsArticle/${"username1"}/${article.id}`;
        await axios.put(APIUrl + route, {
            headers: {
                Authorization: `Bearer ${contextUser.jwtToken}`,
            }
        }).then(result => {
            console.log(result.data);
            setScore(score => score + 1);
            setDownvotedFilled(!downvotedFilled);
        }).catch(error => {
            console.log(error);
        });
    }

    const removeUpvote = async () => {
        var route = `NewsArticle/RemoveUpvoteNewsArticle/${"username1"}/${article.id}`;
        await axios.put(APIUrl + route, {
            headers: {
                Authorization: `Bearer ${contextUser.jwtToken}`,
            }
        }).then(result => {
            console.log(result.data);
            setScore(score => score - 1);
            setUpvotedFilled(!upvotedFilled);
        }).catch(error => {
            console.log(error);
        });
    }

    const handleDownvote = async () => { //treba obraditi situaiju kada je upvote pritisnut a neko pritisne downvote
        if (!downvotedFilled) {
            downvoteNewsArticle();
            if(upvotedFilled){
                setUpvotedFilled(false);
                removeUpvote();
            }
        }
        else
            removeDownvote();
    }

    const handleUpvote = async () => {
        if (!upvotedFilled) {
            upvoteNewsArticle();
            if(downvotedFilled){
                setDownvotedFilled(false);
                removeDownvote();
            }
        }
        else
            removeUpvote();
    }

    const handleBookmarking = async () => {
        if(!bookmarkedFilled)
            addToReadLater();
        else
            removeFromReadLater();
    }

    return (
        <div className="grid w-[330px] p-5 hover:cursor-pointer bg-[#ECE9E4] shadow-xl rounded-md">
            <div className=" flex w-fit h-fit mb-2 text-bold rounded-lg hover:bg-white pointer-events-none">
                <img className="object-contain h-30" src={vienna} onClick={onClick}></img>
            </div>
            <div className="flex mb-2 md:text-lg">
                <span className="text-accent font-bold font-playfair">{article.category}</span>
                <span className="text-dark ml-auto opacity-80 font-playfair">{(new Date(article.createdAt)).toLocaleDateString("en-GB")}</span>
            </div>
            <div className="flex mb-2">
                <span className="break-normal text-dark sm:text-md md:text-xl font-extrabold font-playfair">{article.title}</span>
            </div>
            <div className="flex gap-2 items-center">
                <span className="text-dark sm:text-md md:text-lg font-semibold opacity-80 font-playfair">{score}</span>
                <img className="w-4 h-4" src={upvotedFilled ? arrowUpIconFilled : arrowUpIcon} onClick={() => handleUpvote()}></img>
                <img className="w-4 h-4" src={downvotedFilled ? arrowDownIconFilled : arrowDownIcon} onClick={() => handleDownvote()}></img>
                <img className=" ml-auto w-4 h-4" src={bookmarkedFilled ? bookmarkIconFilled : bookmarkIcon} onClick={() => handleBookmarking()}></img>
            </div>
        </div>
    );
}
