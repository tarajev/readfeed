import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios';
import AuthorizationContext from '../context/AuthorizationContext'
import searchIcon from "../resources/img/icon-search.png"
import { Input, Exit } from '../components/BasicComponents';
import ArticleDisplay from '../components/ArticleDisplay';


export default function SearchResults({ query, onClose }) {

    const { APIUrl, contextUser } = useContext(AuthorizationContext)
    const [search, setSearch] = useState(query);
    const [resultsFor, setResultsFor] = useState(query);
    const [index, setIndex] = useState(0);
    const [result, setResult] = useState([]);

    const searchNewsArticles = async (skip, take, query) => {
        //var route = `NewsArticle/SearchByTitleAndTags/${skip}/${take}`; //da li imati keywords pretragu pa koristiti ovo? ili samo pretrazivati title i tagove bez contenta
        var route = `NewsArticle/FullTextSearch/${skip}/${take}/${query}`;
        await axios.get(APIUrl + route, {
            headers: {
                Authorization: `Bearer ${contextUser.jwtToken}`,
            }
        }).then(result => {
            //setResult((prev) => { return [...prev, ...result.data] });
            setResult(result.data);
            console.log(result.data)
        })
            .catch(error => {
                console.log(error);
            })
    }


    const handleKeyDown = async (e) => {
        if (e.key === "Enter") {
          setResultsFor(search);
          setResult([]);         
          setIndex(0);            
          searchNewsArticles(0, 10, search); 
        }
      };

      useEffect(() => {
        setResultsFor(query);
        setResult([]); 
        setIndex(0);
        searchNewsArticles(0, 10, query);
      }, [query]); 


    return (
        <div className="fixed inset-0 bg-white bg-opacity-90 z-[9999] overflow-auto ">
            <div className='w-2/3 mx-auto h-full  shadow-black-400 inset-shadow-accent inset-shadow-md shadow-lg p-10 flex bg-white flex flex-col items-center '>
                <Exit className={"w-6 ml-auto mb-auto top-0 right-0"} onClick={onClose}></Exit>
                <div className="relative w-full max-w-2xl">
                    <img
                        src={searchIcon}
                        alt="SearchIcon"
                        className="absolute inset-y-0 left-3 w-4 h-4 my-auto z-40"
                    />
                    <Input
                        placeholder='Search'
                        value={search}
                        className="rounded-xl pl-8 bg-[#ECE9E4] w-full h-10 z-20"
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <p className='mt-2'>Results for: <strong>{resultsFor}</strong></p>
                {/* Ovde ide prikaz rezultata */}
                <div className="mt-10 flex flex-row justify-center gap-4 flex-wrap max-w-screen overflow-x-auto h-fit">
                        {result.map((article) => (
                         // <p>{article.title} + NESTO</p>
                         <ArticleDisplay article = {article}></ArticleDisplay>          
                        ))}
                </div>

            </div>
        </div>
    );
}      