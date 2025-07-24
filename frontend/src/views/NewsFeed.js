import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios';
import AuthorizationContext from '../context/AuthorizationContext'
import Tag from '../components/Tag'
import ArticleDisplay from '../components/ArticleDisplay'
import arrowDownIconFilled from "../resources/img/arrow-down-filled.png"
import DrawAddInterests from './AddInterests';

export default function NewsFeed({ addToReadLaterSection, removeFromReadLaterSection }) {
  const { APIUrl, contextUser } = useContext(AuthorizationContext)
  const [criteria, setCriteria] = useState("popular")
  const [tags, setTags] = useState(contextUser.role == "Guest" ? [] : contextUser.subscribedCategories);
  // const [tags, setTags] = useState(["World Politics", "Economics", "Sports", "Politics", "Climate", "Tech", "Health", "Music", "Movies", "Dance", "Television", "Lifestyle", "Arts", "Cooking"])
  const [latestNews, setLatestNews] = useState([]);
  const [popularNews, setPopularNews] = useState([]);
  const [popularIndex, setPopularIndex] = useState(0);
  const [latestIndex, setLatestIndex] = useState(0);
  const [drawAddInterests, setDrawInterests] = useState(false);
  const [moreAvailable, setMoreAvailable] = useState(true);

  useEffect(() => {
    console.log("Context user:", contextUser);
    setTags(contextUser.role == "Guest" ? [] : contextUser.subscribedCategories || []);
  }, [contextUser]);

  const getMostPopularNews = async (skip, take) => {
    var route = `NewsArticle/GetMostPopularNewsArticles/${skip}/${take}/${contextUser.username}`;
    await axios.get(APIUrl + route, {
      params: {
        followedCategories: tags
      },
      paramsSerializer: {
        indexes: null
      },
      headers: {
        Authorization: `Bearer ${contextUser.jwtToken}`
      }
    })
      .then(result => {
        setPopularNews(prevNews => {
          const newArticles = result.data.filter(
            article => !prevNews.some(existing => existing.id === article.id)
          );
          return [...prevNews, ...newArticles];
        });
        //setPopularNews(result.data);
      })
      .catch(error => {
        console.log(error);
        setMoreAvailable(false);
      })

  }

  const getLatestNews = async (skip, take) => {
    var route = `NewsArticle/GetMostRecentNewsArticles/${skip}/${take}/${contextUser.username}`;
    await axios.get(APIUrl + route, {
      params: {
        followedCategories: tags
      },
      paramsSerializer: {
        indexes: null
      },
      headers: {
        Authorization: `Bearer ${contextUser.jwtToken}`
      }
    })
      .then(result => {
        setLatestNews(prevNews => {
          const newArticles = result.data.filter(
            article => !prevNews.some(existing => existing.id === article.id)
          );
          return [...prevNews, ...newArticles];
        });
        //setLatestNews(result.data);
      })
      .catch(error => {
        console.log(error);
        setMoreAvailable(false);
      })
  }

  useEffect(() => {
    if (criteria === "popular" && tags && tags.length > 0)
      getMostPopularNews(popularIndex * 20, 20);
    else if (tags && tags.length > 0)
      getLatestNews(latestIndex * 20, 20);
  }, [criteria, tags, popularIndex, latestIndex])

  return (<>
    {drawAddInterests && <DrawAddInterests onClose={() => setDrawInterests(false)} existingTags={tags} onChange={setTags}></DrawAddInterests>}
    {sessionStorage.setItem('scrollPosition', window.scrollY)}
    <div className='grid h-full w-full'>
      <div className='flex justify-between'>
        <div className='flex flex-wrap items-center'>
          {tags && tags.map((tag, index) => (
            <Tag key={index} text={tag} onClick={() => {
              const newTags = tags.filter(t => t !== tag); setTags(newTags); setPopularNews([]); setLatestNews([]); setPopularIndex(0); setLatestIndex(0); //brisanje starih vesti
            }}></Tag>
          ))}
          {(contextUser.role != "Guest" && contextUser.$type !== "Author") && <div onClick={() => setDrawInterests(true)} className='p-1 px-2 rounded-lg font-semibold ml-5 my-auto hover:cursor-pointer hover:bg-[#ECE9E4]'>+ Add interests</div>}
        </div>
        : <></>
        <div className='justify-self-end ml-[120px] mr-4 '>
          <select
            id="newscriteria"
            name="newscriteria"
            value={criteria}
            onChange={(e) => { setCriteria(e.target.value); setMoreAvailable(true); }}
            className="border bg-[#ECE9E4] font-semibold rounded-lg px-2 py-1"
          >
            <option value="popular">Popular</option>
            <option value="latest">Latest</option>
          </select>
        </div>
      </div>

      <div className='flex gap-8 flex-wrap justify-evenly items-center mt-20'>
        {criteria === "popular" ?
          popularNews.map((article, index) => (
            < ArticleDisplay key={article.id} article={article} addToReadLaterSection={addToReadLaterSection} removeFromReadLaterSection={removeFromReadLaterSection}></ArticleDisplay>
          )) :
          latestNews.map((article, index) => (
            < ArticleDisplay key={article.id} article={article} addToReadLaterSection={addToReadLaterSection} removeFromReadLaterSection={removeFromReadLaterSection}></ArticleDisplay>
          ))
        }
      </div>
      <div>
        {moreAvailable && <button
          onClick={() => {
            if (criteria === "popular")
              setPopularIndex(index => index + 1);
            else
              setLatestIndex(index => index + 1);
          }}
          className="mt-10 p-2 place-self-center bg-secondary shadow-md text-white rounded-full flex items-center gap-2 hover:bg-light"
        >
          <img src={arrowDownIconFilled} alt="Load More" className="w-4 h-4" />
        </button>}
      </div>
    </div>
  </>);
}