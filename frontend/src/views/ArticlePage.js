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
import Tag from '../components/Tag';
import ReactQuill from 'react-quill-new';

export default function ArticlePage() {
  const { APIUrl, contextUser } = useContext(AuthorizationContext)
  const location = useLocation();
  const params = useParams();
  const [articleDetials, setArticleDetails] = useState([])

  const isPreview = params.title?.startsWith('preview-');

  const [article, setArticle] = useState(() => {
    if (isPreview) {
      const previewArticle = sessionStorage.getItem('previewArticle');
      return previewArticle ? JSON.parse(previewArticle) : null;
    }
    else
      return location.state?.article || null;
  });

  const [upvotedFilled, setUpvotedFilled] = useState(false);
  const [downvotedFilled, setDownvotedFilled] = useState(false);
  const [bookmarkedFilled, setBookmarkedFilled] = useState(false);
  const [tags, setTags] = useState([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!article) {
      if (params.id != null)
        getArticle();
      else
        console.log("Id nije prosledjen");
    }
  }, []);

  useEffect(() => {
    if (article) {
      setUpvotedFilled(article.upvoted || false);
      setDownvotedFilled(article.downvoted || false);
      setBookmarkedFilled(article.bookmarked || false);
      setTags(article.tags ? article.tags.split("|") : []);
      setScore(article.score || 0);
    }
  }, [article]);

  const getArticle = async () => {
    console.log("getArticle");
    axios.get(`${APIUrl}NewsArticle/GetNewsArticleById/${params.id}`)
      .then((response) => {
        setArticle(response.data);
        console.log("data" + response.data);
      })
      .catch((error) => {
        console.error("Error fetching article:", error);
      });
  }

  const addToReadLater = async () => { //treba da se prikaze u read later
    if (isPreview) return;

    var route = `NewsArticle/AddToReadLater/${contextUser.username}/${article.id}`;
    await axios.post(APIUrl + route, {}, {
      headers: {
        Authorization: `Bearer ${contextUser.jwtToken}`,
      }
    }).then(result => {
      setBookmarkedFilled(!bookmarkedFilled);
    }).catch(error => {
      console.log(error);
    });
  }

  const removeFromReadLater = async () => {
    if (isPreview) return;

    var route = `NewsArticle/RemoveArticleFromReadLater/${contextUser.username}/${article.id}`;
    await axios.delete(APIUrl + route, {
      headers: {
        Authorization: `Bearer ${contextUser.jwtToken}`,
      }
    }).then(result => {
      setBookmarkedFilled(!bookmarkedFilled);
    }).catch(error => {
      console.log(error);
    });
  }

  const upvoteNewsArticle = async () => {
    if (isPreview) return;

    var route = `NewsArticle/UpvoteNewsArticle/${contextUser.username}/${article.id}`;
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
    if (isPreview) return;

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
    if (isPreview) return;

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
    if (isPreview) return;

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
    if (isPreview) return;

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
    if (isPreview) return;

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
    if (isPreview) return;

    if (!bookmarkedFilled)
      addToReadLater();
    else
      removeFromReadLater();
  }

  useEffect(() => {
    window.scrollTo(0, 0);

    return () => {
      if (isPreview) {
        sessionStorage.removeItem('previewArticle');
      }
    };
  }, [isPreview]);

  return (
    <Page loading={true} >
      {!article ? (
        <div className="p-10 text-center">
          <p className="text-xl">Loading article...</p>
        </div>
      ) : (
        <div className="px-4 h-full flex flex-col">
          {isPreview && (
            <div className="bg-gray-200 border-l-4 border-gray-400 text-gray-700 p-4 mb-4">
              <p className="font-bold">Preview Mode</p>
              <p className="text-sm">This is a preview of your article. Voting and bookmarking are disabled.</p>
            </div>
          )}

          <div className="mx-auto ">
            <h1 className='text-center p-10 text-5xl font-bold font-playfair italic'>{article.title}</h1>
          </div>
          <p className='md:mx-60 font-playfair'>Article by: {article.authorName}</p>
          <div className="md:mx-60 border-b-4 border-secondary  "></div> {/*linija*/}
          <div className='gap-4 md:mx-60 mt-2 flex justify-start items-center'>
            <span className="text-dark sm:text-lg md:text-xl font-semibold opacity-80 font-playfair">{score}</span>
            <img className={`w-5 h-5 ${contextUser.$type === "User" ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`} src={upvotedFilled ? arrowUpIconFilled : arrowUpIcon} onClick={contextUser.$type === "User" ? handleUpvote : () => { }}></img>
            <img className={`w-5 h-5 ${contextUser.$type === "User" ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`} src={downvotedFilled ? arrowDownIconFilled : arrowDownIcon} onClick={contextUser.$type === "User" ? handleDownvote : () => { }}></img>
            <img className={`w-5 h-5 ${contextUser.$type === "User" ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`} src={bookmarkedFilled ? bookmarkIconFilled : bookmarkIcon} onClick={contextUser.$type === "User" ? handleBookmarking : () => { }}></img>
            <span className="ml-auto text-dark sm:text-lg md:text-xl font-semibold opacity-80 font-playfair">{"22.04.2025."}</span>
          </div>
          <div className="mx-auto mt-10">
            <div className="md:mx-40 mb-4 font-playfair sm:text-sm md:text-lg">    {/*Content u zavisnosti od toga kako se bude pamtio? */}
              <div className="mx-auto my-2 w-md">
                {article.photos && article.photos.length > 0 && (
                  <img className="object-contain" src={isPreview ? article.photos[0] : `http://localhost:5000${article.photos[0]}`} />
                )} {/* da se izmeni ako se photos izmeni */}
              </div>
              <ReactQuill value={article.content} readOnly theme="snow" modules={{ toolbar: false }} style={{ height: 'auto' }}>
                <div className="ql-editor" style={{ fontSize: '20px', padding: 0, border: "none", fontFamily: 'Georgia, serif' }} />
              </ReactQuill>
            </div>
            {article.link && article.link.trim() !== "" && (
              <div className='my-2 md:mx-40 text-dark sm:text-md md:text-lg font-semibold font-playfair'>
                Read more:{' '}
                <a href={article.link} className='text-blue-500 hover:underline' target="_blank" rel="noopener noreferrer">
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
      )}
    </Page>
    // negde da se stavi ko je objavio?   
  );
}