import React, { useState, useContext } from 'react'
import AuthorizationContext from '../context/AuthorizationContext'
import Tag from '../components/Tag'

export default function NewsFeed() {
    const { APIUrl, contextUser } = useContext(AuthorizationContext)
    const [criteria, setCriteria] = useState("popular")
    const [tags, setTags] = useState(["World", "Sports", "Politics", "Climate", "Tech", "Health", "Music", "Movies", "Dance", "Television", "Lifestyle", "Arts", "Cooking"])

    return (<>
        <div className='grid h-full w-full'>
            <div className='flex justify-between'>
                <div className='flex flex-wrap items-center'> 
                {tags.map((tag, index) => (
                    <Tag key={index} text={tag} onClick={() => setTags(tags.filter(t => t !== tag))}></Tag>
                ))}
                <div className=' p-1 px-2 rounded-lg font-semibold ml-5 mt-0 my-auto hover:cursor-pointer hover:bg-[#ECE9E4]'>+ Add interests</div>
                </div>
                <div className='justify-self-end ml-[120px] mr-4 '>
                    <select
                        id="newscriteria"
                        name="newscriteria"
                        value={criteria}
                        onChange={(e) => setCriteria(e.target.value)}
                        className="border bg-[#ECE9E4] font-semibold rounded-lg px-2 py-1"
                        >
                        <option value="popular">Popular</option>
                        <option value="latest">Latest</option>
                    </select>
                </div>
            </div>

        </div>
    </>);
}