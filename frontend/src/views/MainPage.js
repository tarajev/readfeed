import React, { useState, useContext } from 'react'
import AuthorizationContext from '../context/AuthorizationContext'
import { Page } from '../components/BasicComponents';
import Tabs from '../components/Tabs'
import  '../assets/colors.css'
import '../assets/animations.css'
import NewsFeed from './NewsFeed';


export default function DrawMainPage() {
  const { APIUrl, contextUser } = useContext(AuthorizationContext)
  const [search, setSearch] = useState(''); // Za pretragu serija
  const [overlayActive, setOverlayActive] = useState(false); // Potrebno za prevenciju background-tabovanja kada je forma aktivna

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setSearch('');
    }
  };

  // TODO - Da se popuni stranica
  return (

    <Page overlayActive={overlayActive} loading={true} overlayHandler={setOverlayActive}>
      <Tabs DrawTab1={() => <NewsFeed/> } DrawTab2={() => { } }></Tabs>

    </Page>
  );
}