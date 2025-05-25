import { useState, useContext, useEffect } from 'react'
import { useLocation, useParams } from "react-router-dom";
import axios from 'axios';
import AuthorizationContext from '../context/AuthorizationContext'
import { Page } from '../components/BasicComponents';
import arrowUpIcon from "../resources/img/arrow-up-outline.png"
import arrowDownIcon from "../resources/img/arrow-down-outline.png"
import bookmarkIcon from "../resources/img/icon-bookmark-outline.png"
import arrowUpIconFilled from "../resources/img/arrow-up-filled.png"
import arrowDownIconFilled from "../resources/img/arrow-down-filled.png"
import bookmarkIconFilled from "../resources/img/icon-bookmark-filled.png"
import vienna from "../images/vienna.jpg"
import Tag from '../components/Tag';
import ReactQuill from 'react-quill-new';

export default function ArticlePage() {
  const { APIUrl, contextUser } = useContext(AuthorizationContext)
  const location = useLocation();
  const [article, setArticle] = useState(location.state?.article);

  const [upvotedFilled, setUpvotedFilled] = useState(article.upvoted ? true : false);
  const [downvotedFilled, setDownvotedFilled] = useState(article.downvoted ? true : false);
  const [bookmarkedFilled, setBookmarkedFilled] = useState(article.bookmarked ? true : false);

  const [tags, setTags] = useState(article.tags.split("|"));
  const [score, setScore] = useState(article.score);

  const addToReadLater = async () => { //treba da se prikaze u read later
    var route = `NewsArticle/AddToReadLater/${contextUser.username}/${article.id}`;
    await axios.post(APIUrl + route, {}, {
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
    var route = `NewsArticle/RemoveArticleFromReadLater/${contextUser.username}/${article.id}`;
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
    var route = `NewsArticle/UpvoteNewsArticle/${contextUser.username}/${article.id}`;
    await axios.put(APIUrl + route, {}, {
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
    var route = `NewsArticle/DownvoteNewsArticle/${contextUser.username}/${article.id}`;
    await axios.put(APIUrl + route, {}, {
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
    var route = `NewsArticle/RemoveDownvoteNewsArticle/${contextUser.username}/${article.id}`;
    await axios.put(APIUrl + route, {}, {
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
    var route = `NewsArticle/RemoveUpvoteNewsArticle/${contextUser.username}/${article.id}`;
    await axios.put(APIUrl + route, {}, {
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

  useEffect(() => {
    // Skrolovanje na vrh stranice u startu
    window.scrollTo(0, 0);
  }, []);

  return (
    <Page loading={true} >
      <div className="px-4 h-full flex flex-col">
        <div className="mx-auto ">
          <h1 className='text-center p-10 text-5xl font-bold font-playfair italic'>{article.title}</h1>
        </div>
        <div className="md:mx-60 border-b-4 border-secondary  "></div> {/*linija*/}
        <div className='gap-4 md:mx-60 mt-2 flex justify-start items-center'>
          <span className="text-dark sm:text-lg md:text-xl font-semibold opacity-80 font-playfair">{score}</span>
          <img className="w-5 h-5" src={upvotedFilled ? arrowUpIconFilled : arrowUpIcon} onClick={() => handleUpvote()}></img>
          <img className="w-5 h-5" src={downvotedFilled ? arrowDownIconFilled : arrowDownIcon} onClick={() => handleDownvote()}></img>
          <img className="w-5 h-5" src={bookmarkedFilled ? bookmarkIconFilled : bookmarkIcon} onClick={() => handleBookmarking()}></img>
          <span className="ml-auto text-dark sm:text-lg md:text-xl font-semibold opacity-80 font-playfair">{"22.04.2025."}</span>
        </div>
        <div className="mx-auto mt-10">
          <div className="md:mx-40 mb-4 font-playfair sm:text-sm md:text-lg">    {/*Content u zavisnosti od toga kako se bude pamtio? */}
            <div className="mx-auto my-2 w-md">
              <img className="object-contain" src={vienna}></img> {/* article.photos[0] ili article.photo kad se izmeni to */}
            </div>
            <ReactQuill value={article.content} readOnly theme="snow" modules={{ toolbar: false }} style={{ height: 'auto' }}>
              <div className="ql-editor" style={{ fontSize: '20px', padding: 0, border: "none", fontFamily: 'Georgia, serif' }} />
            </ReactQuill>
          </div>
          {article.link && article.link.trim() !== "" && (
            <div className='my-2 md:mx-40 text-dark sm:text-md md:text-lg font-semibold font-playfair'>
              Read more:{' '}
              <a href={article.link} className='text-blue-700 hover:underline' target="_blank" rel="noopener noreferrer">
                {article.link}
              </a>
            </div>
          )}
          <div className="flex flex-row md:mx-40">
            <span className='text-dark sm:text-md md:text-lg font-semibold opacity-80 font-playfair mr-4'>Tags:</span>
            {tags.map((tag, index) => (
              <Tag key={index} text={tag} displayOnly={true}></Tag> //da li da bude clickable pa da se prikazu ostale vesti sa tim tagom?
            ))}
          </div>
        </div>

      </div>
    </Page>
    // negde da se stavi ko je objavio?   
  );
}