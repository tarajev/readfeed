import React, { useState, useContext, useEffect } from 'react'
import AuthorizationContext from '../context/AuthorizationContext'
import axios from 'axios';
import { Page } from '../components/BasicComponents';
import Tabs from '../components/Tabs'
import SlidingPanel from '../components/SlidingPanel';
import '../assets/colors.css'
import '../assets/animations.css'
import NewsFeed from './NewsFeed';


export default function DrawMainPage() {
  const { APIUrl, contextUser } = useContext(AuthorizationContext)
  const [overlayActive, setOverlayActive] = useState(false); // Potrebno za prevenciju background-tabovanja kada je forma aktivna
  const [readLater, setReadLater] = useState([]);

  const getReadLaterNews = async () => {
    var route = `NewsArticle/GetReadLaterArticles/${contextUser.username}`;
    await axios.get(APIUrl + route, {
      headers: {
        Authorization: `Bearer ${contextUser.jwtToken}`,
      }
    }).then(result => {
      setReadLater(result.data);
      console.log(result.data)
    })
      .catch(error => {
        console.log(error);
      })

  }

  useEffect(() => {
   getReadLaterNews();
  }, [])

  const addToReadLaterSection = (newItem) => {
    setReadLater(prev => [...prev, newItem]);
    console.log("Dodato u Read Later:", newItem);
  };

  const removeFromReadLaterSection = (id) => {
    setReadLater(prev => prev.filter(article => article.id !== id));
    console.log("Uklonjeno iz Read Later:", id);
  };


  return (

    <Page overlayActive={overlayActive} loading={true} overlayHandler={setOverlayActive} slidingPanel={<SlidingPanel children={readLater} removeFromSlidingPanel={removeFromReadLaterSection} addToSlidingPanel={addToReadLaterSection} />}>
      <Tabs DrawTab1={() => <NewsFeed addToReadLaterSection={addToReadLaterSection} removeFromReadLaterSection={removeFromReadLaterSection} />} DrawTab2={() => { }}></Tabs>
    </Page>
  );
}