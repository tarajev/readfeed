import { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Page } from '../components/BasicComponents'
import AuthorizationContext from '../context/AuthorizationContext'
import axios from 'axios'

import ArticleDisplay from '../components/ArticleDisplay';

import iconUser from "../resources/img/icon-user.png"

export default function AuthorPage() {
  const { id } = useParams();
  const { APIUrl, contextUser } = useContext(AuthorizationContext);

  const [author, setAuthor] = useState(null);

  const [overlayActive, setOverlayActive] = useState(false); // Potrebno za prevenciju background-tabovanja kada je forma aktivna
  const navigate = useNavigate();

  const testNews = [
    { title: "New AI technology is changing the way developers work", category: "Technology", createdAt: "2025-02-11", score: 120 },
    { title: "Premiere of the highly anticipated movie breaks records", category: "Entertainment", createdAt: "2025-02-10", score: 85 },
    { title: "Bitcoin reaches a new all-time high", category: "Economy", createdAt: "2025-02-09", score: 200 },
    { title: "Football derby ends with an unexpected result", category: "Sports", createdAt: "2025-02-10", score: 95 },
    { title: "Latest web design trends for 2025", category: "Technology", createdAt: "2025-02-11", score: 50 },
    { title: "Political debate sparks heated reactions", category: "Politics", createdAt: "2025-02-08", score: 65 },
    { title: "New research reveals secrets to a healthy lifestyle", category: "Health", createdAt: "2025-02-07", score: 80 }
  ];

  return (
    <Page loading={true} timeout={1000} overlayActive={overlayActive} overlayHandler={setOverlayActive}>
      <div className='mt-4 mx-2 font-playfair'>
        <div className='grid p-2 grid-cols-12 gap-4 h-fit bg-gradient-to-r from-gray-200 to-[#F4F1EC] rounded-lg'>
          <div className='col-span-3 md:col-span-2 overflow-x-clip content-center '>
            <img className={`max-w-36 max-h-36 justify-self-center border border-black rounded-lg filter-gray w-28"`} src={iconUser} />
          </div>
          <div className='col-span-9 md:col-span-10'>
            <div className='sm:text-3xl font-semibold text-[#07090D]'>
              Some Author
            </div>
            <div className='text-gray-600'>
              This author is an experienced journalist and author, specializing in creating news articles and content in the fields of technology and politics. With years of experience writing for renowned media outlets, Marko stands out for his accuracy and ability to quickly and clearly convey the latest information. His writing style is clear, informative, and objective, always aiming to provide deeper analysis of current events.
            </div>
          </div>
        </div>

        <p className='mt-6 sm:text-2xl font-semibold text-[#07090D] justify-self-center'>
          Articles:
        </p>
        <hr className='bg-gray-600 pt-0.5 mb-8' />

        <div className='grid grid-cols-3 justify-items-center gap-4'>
          {testNews.map((article, index) => (
            <ArticleDisplay key={index} article={article} />
          ))}
        </div>
      </div>
    </Page>
  );
}

