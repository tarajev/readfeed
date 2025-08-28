import { useState, useContext, useEffect } from "react";
import axios from 'axios';
import AuthorizationContext from '../context/AuthorizationContext'
import arrowUpIcon from "../resources/img/arrow-up-outline.png"
import arrowDownIcon from "../resources/img/arrow-down-outline.png"
import bookmarkIcon from "../resources/img/icon-bookmark-outline.png"
import arrowUpIconFilled from "../resources/img/arrow-up-filled.png"
import arrowDownIconFilled from "../resources/img/arrow-down-filled.png"
import bookmarkIconFilled from "../resources/img/icon-bookmark-filled.png"
import vienna from "../images/vienna.jpg"
import { useNavigate } from "react-router-dom"

export default function ArticleDisplay({ article, className, removeFromReadLaterSection, addToReadLaterSection, readLater }) {
  const { APIUrl, contextUser } = useContext(AuthorizationContext)
  const [upvotedFilled, setUpvotedFilled] = useState(article.upvoted ? true : false);
  const [downvotedFilled, setDownvotedFilled] = useState(article.downvoted ? true : false);
  const [bookmarkedFilled, setBookmarkedFilled] = useState(article.bookmarked ? true : false);
  const [score, setScore] = useState(article.score);
  const navigate = useNavigate();

  const addToReadLater = async () => {//treba da se prikaze u read later
    var route = `NewsArticle/AddToReadLater/${contextUser.username}/${article.id}`;
    await axios.post(APIUrl + route, {}, {
      headers: {
        Authorization: `Bearer ${contextUser.jwtToken}`,
      }
    }).then(result => {
      setBookmarkedFilled(!bookmarkedFilled);
      addToReadLaterSection(article);
    }).catch(error => {
      console.log(error);
    });
  }

  const removeFromReadLater = async () => {
    var route = `NewsArticle/RemoveArticleFromReadLater/${contextUser.username}/${article.id}`;
    await axios.delete(APIUrl + route, {
      headers: {
        Authorization: `Bearer ${contextUser.jwtToken}`,
      }
    }).then(result => {
      setBookmarkedFilled(!bookmarkedFilled);
      if (removeFromReadLaterSection) {
        removeFromReadLaterSection(article.id);
      }
    }).catch(error => {
      console.log(error);
    });
  }

  const upvoteNewsArticle = async () => {
    var route = `NewsArticle/UpvoteNewsArticle/${contextUser.username}/${article.id}`; //username1 privremeno => ${contextUser.username}
    await axios.put(APIUrl + route, {}, {
      headers: {
        Authorization: `Bearer ${contextUser.jwtToken}`,
      }
    }).then(result => {
      setScore(score => score + 1);
      setUpvotedFilled(!upvotedFilled);
    }).catch(error => {
      console.log(error);
    });
  }

  const downvoteNewsArticle = async () => {
    var route = `NewsArticle/DownvoteNewsArticle/${contextUser.username}/${article.id}`;
    await axios.put(APIUrl + route, {}, {
      headers: {
        Authorization: `Bearer ${contextUser.jwtToken}`,
      }
    }).then(result => {
      setScore(score => score - 1);
      setDownvotedFilled(!downvotedFilled);
    }).catch(error => {
      console.log(error);
    });
  }

  const removeDownvote = async () => {
    var route = `NewsArticle/RemoveDownvoteNewsArticle/${contextUser.username}/${article.id}`;
    await axios.put(APIUrl + route, {}, {
      headers: {
        Authorization: `Bearer ${contextUser.jwtToken}`,
      }
    }).then(result => {
      setScore(score => score + 1);
      setDownvotedFilled(!downvotedFilled);
    }).catch(error => {
      console.log(error);
    });
  }

  const removeUpvote = async () => {
    var route = `NewsArticle/RemoveUpvoteNewsArticle/${contextUser.username}/${article.id}`;
    await axios.put(APIUrl + route, {}, {
      headers: {
        Authorization: `Bearer ${contextUser.jwtToken}`,
      }
    }).then(result => {
      setScore(score => score - 1);
      setUpvotedFilled(!upvotedFilled);
    }).catch(error => {
      console.log(error);
    });
  }

  const handleDownvote = async () => { //treba obraditi situaiju kada je upvote pritisnut a neko pritisne downvote
    if (!downvotedFilled) {
      downvoteNewsArticle();
      if (upvotedFilled) {
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
      if (downvotedFilled) {
        setDownvotedFilled(false);
        removeDownvote();
      }
    }
    else
      removeUpvote();
  }

  const handleBookmarking = async () => {
    if (!bookmarkedFilled)
      addToReadLater();
    else
      removeFromReadLater();
  }

  const handleOnClick = async () => {
    navigate(`/articlepage/${encodeURIComponent(article.title)}/${encodeURIComponent(article.id)}/${encodeURIComponent(article.authorName)}`, { state: { article } });
  }

  useEffect(() => {
    if (readLater) {
      const isBookmarked = readLater.some(a => a.id === article.id);
      setBookmarkedFilled(isBookmarked);
    }
  }, [readLater, article.id]);

  return (
    <div className={`grid w-[330px] h-fit p-5 cursor-default bg-[#ECE9E4] shadow-xl rounded-md ${className}`}>
      <div className="flex w-fit h-fit mb-2 text-bold rounded-lg hover:bg-white cursor-pointer" onClick={() => handleOnClick()}>
        <img className="object-contain h-30" src={article.photos ? `http://localhost:5000${article.photos[0]}` : vienna} /> {/* da se izmeni ako se photos izmeni */}
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
        <img className={`w-4 h-4 ${contextUser.$type === "User" ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`} src={upvotedFilled ? arrowUpIconFilled : arrowUpIcon} onClick={contextUser.$type === "User" ? handleUpvote : () => { }}></img>
        <img className={`w-4 h-4 ${contextUser.$type === "User" ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`} src={downvotedFilled ? arrowDownIconFilled : arrowDownIcon} onClick={contextUser.$type === "User" ? handleDownvote : () => { }}></img>
        <img className={`ml-auto w-4 h-4 ${contextUser.$type === "User" ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`} src={bookmarkedFilled ? bookmarkIconFilled : bookmarkIcon} onClick={contextUser.$type === "User" ? handleBookmarking : () => { }}></img>
      </div>
    </div>
  );
}
