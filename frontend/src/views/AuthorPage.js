import { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

import AuthorizationContext from '../context/AuthorizationContext'
import axios from 'axios'
import iconUser from "../resources/img/icon-user.png"

import { EditableInput, Page } from '../components/BasicComponents'
import { FileUpload } from '../components/BasicComponents';
import ArticleDisplay from '../components/ArticleDisplay';

export default function AuthorPage() {
  const { id } = useParams();
  const { APIUrl, contextUser } = useContext(AuthorizationContext);

  const [author, setAuthor] = useState(null);
  const [picture, setPicture] = useState(null);
  const [articles, setArticles] = useState([]);
  const [authorBio, setAuthorBio] = useState(author?.bio);

  const [overlayActive, setOverlayActive] = useState(false); // Potrebno za prevenciju background-tabovanja kada je forma aktivna
  const navigate = useNavigate();

  const getAuthorById = async () => {
    const headers = {};
    if (contextUser.jwtToken) {
      headers.Authorization = `Bearer ${contextUser.jwtToken}`;
    }

    axios.get(`${APIUrl}Author/GetAuthorById/${id}`, { headers })
      .then((response) => setAuthor(response.data))
      .catch((error) => console.error("Error fetching author:", error));
  }

  const getArticlesByAuthor = async () => {
    axios.get(`${APIUrl}NewsArticle/GetNewsArticleByAuthor/${id}`, {
      headers: {
        Authorization: `Bearer ${contextUser.jwtToken}`,
      }
    })
      .then((response) => {
        setArticles(response.data)
      })
      .catch((error) => {
        console.error("Error fetching articles:", error);
      });
  }

  const uploadAuthorPicture = async (article) => {
    if (!picture) return;

    const formData = new FormData();
    formData.append('file', picture);

    await axios.put(`${APIUrl}Author/UploadAuthorPicture/${contextUser.id}`, formData, {
      headers: {
        Authorization: `Bearer ${contextUser.jwtToken}`,
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        window.location.reload();
      })
      .catch(error => {
        console.error('Thumbnail upload error:', error);
      });
  }

  useEffect(() => {
    if (id) {
      getAuthorById();
      getArticlesByAuthor();
    }
  }, []);

  useEffect(() => {
    if (picture) {
      uploadAuthorPicture();
    }
  }, [picture]);

  useEffect(() => {
    if (!authorBio || authorBio === author.bio) return;

    axios.put(`${APIUrl}Author/UpdateAuthor/${contextUser.id}`, JSON.stringify(authorBio), {
      headers: {
        Authorization: `Bearer ${contextUser.jwtToken}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        setAuthor(prev => prev ? { ...prev, bio: authorBio } : prev);
      })
      .catch(error => {
        console.error('Thumbnail upload error:', error);
      });
  })

  return (
    <Page loading={true} timeout={1000} overlayActive={overlayActive} overlayHandler={setOverlayActive}>
      <div className='mt-4 mx-2 font-playfair'>
        <div className='grid p-2 grid-cols-12 gap-4 h-fit bg-gradient-to-r from-gray-200 to-[#F4F1EC] rounded-lg'>
          <div className='col-span-3 md:col-span-2 overflow-x-clip content-center'>
            <div className="relative group xl:mx-7">
              <img className={`max-w-36 max-h-36 justify-self-center border border-black rounded-lg ${author?.picture ? "" : "filter-gray"} w-34`} src={author?.picture ? `http://localhost:5000${author.picture}` : iconUser} />
              {contextUser.id == id ?
                <div className="absolute inset-0 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black bg-opacity-30">
                  <FileUpload buttonText="Change" setPicture={setPicture} limitInMegabytes={3} filenameHidden />
                </div>
                : <></>
              }
            </div>
          </div>
          <div className='col-span-9 md:col-span-10'>
            <div className='flex items-baseline gap-2'>
              <h2 className='sm:text-3xl font-semibold text-[#07090D]'>
                {author?.fullName}
              </h2>
              <p className='text-gray-500'>
                ({author?.newspaper ?? "Independent"})
              </p>
            </div>
            <div className='text-gray-600'>
              {contextUser.id === id
                ? <EditableInput initialValue={author?.bio} setValue={setAuthorBio} label={author?.bio} />
                : <p>{author?.bio}</p>
              }
            </div>
          </div>
        </div>

        <p className='mt-6 sm:text-2xl font-semibold text-[#07090D] justify-self-center'>
          Articles:
        </p>
        <hr className='bg-gray-600 pt-0.5 mb-8' />

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-4'>
          {articles.map((article, index) => (
            <ArticleDisplay key={index} article={article} />
          ))}
        </div>
      </div>
    </Page>
  );
}

