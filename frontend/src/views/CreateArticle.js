import { useState, useContext } from "react";
import AuthorizationContext from "../context/AuthorizationContext";
import { FileUpload, FormButton, FormInput, Page } from "../components/BasicComponents";
import Tag from "../components/Tag";
import axios from "axios";
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

export default function ArticlePage() {
  const { APIUrl, contextUser } = useContext(AuthorizationContext)

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, addTag] = useState([]);
  const [picture, setPicture] = useState(null);
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");

  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();

      const normalizeToTitleCase = (str) =>
        str.trim().split(" ")
          .filter(word => word.length > 0)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" ");

      const normalizedTag = normalizeToTitleCase(tagInput);

      if (!tags.includes(normalizedTag)) {
        addTag((prev) => [...prev, normalizedTag]);
      }

      setTagInput("");
    }
  };

  const checkFields = () => {
    if (!description) setErrorMessage("Description not set!");
    if (tags.length === 0) setErrorMessage("Tags not set!");
    if (!category) setErrorMessage("Category not set!");
    if (!picture) setErrorMessage("Picture not set!");
    if (!title) setErrorMessage("Title not set!");

    if (!(title && picture && category && tags.length !== 0 && description)) return false;

    setErrorMessage("");
    return true;
  }

  const previewArticle = async () => {
    if (!checkFields()) return;

    const dummyArticle = {
      id: 'preview-' + Date.now(),
      title: title,
      content: description,
      category: category,
      tags: tags.join('|'),
      photos: picture ? [URL.createObjectURL(picture)] : [],
      link: link,
      author: contextUser?.username // TODO: Ime i prezime umesto ovoga
    };

    sessionStorage.setItem('previewArticle', JSON.stringify(dummyArticle));
    const newTab = window.open(`/articlepage/preview-${Date.now()}`, '_blank');
    newTab.focus();
  };

  const uploadArticleThumbnail = async (articleId) => {
    if (!picture) return;

    const formData = new FormData();
    formData.append('file', picture);

    axios.put(`${APIUrl}NewsArticle/UploadArticleThumbnail/${articleId}`, formData, {
      headers: {
        Authorization: `Bearer ${contextUser.jwtToken}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    .catch(error => {
      console.log('Thumbnail upload error:', error);
    });
  }

  const submitArticle = async () => {
    if (!checkFields()) return;
    setLoading(true);

    const article = {
      title: title,
      content: description,
      category: category,
      tags: tags.join('|'),
      link: link,
      author: contextUser?.username // TODO: treba ime i prezime umesto ovoga
    }

    let result = axios.post(`${APIUrl}NewsArticle/AddNewsArticle`, article, {
      headers: {
        Authorization: `Bearer ${contextUser.jwtToken}`,
        'Content-Type': 'application/json'
      }
    }).then(response => {
      uploadArticleThumbnail(response.data.id);
    }).catch(error => {
      console.log(error);
    }).finally(() => {
      setLoading(false);
      // if (result) window.location.reload();
    });
  }

  return (
    <Page loading={true}>
      <div className="mt-5 px-3 sm:px-10 flex flex-col">
        <div className="flex flex-col gap-6">
          <FormInput text="Title:" required value={title} onChange={(e) => setTitle(e.target.value)} className="!text-xl !border-gray-300" />
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-3 sm:col-span-1">
              <div className="px-3 pb-3 pt-2 border border-gray-300 rounded-md">
                <FormInput text="Category:" required value={category} onChange={(e) => setCategory(e.target.value)} className="!border-gray-300" />
              </div>

              <div className="mt-6 px-3 pb-3 pt-2 border border-gray-300 rounded-md">
                <FormInput text="Tags:" required value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={onKeyDown} className="mb-2 !border-gray-300" />
                <div className="flex flex-wrap gap-2 mt-2 h-28 overflow-y-auto">
                  {tags.map((tag, idx) => (
                    <Tag key={idx} text={tag}
                      onClick={() => addTag(tags.filter((_, i) => i !== idx))}
                      displayOnly={false}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="h-[20.5rem] col-span-3 sm:col-span-2 flex flex-col p-2 border border-gray-300 rounded-md">
              <img src={picture ? URL.createObjectURL(picture) : null} className="h-[80%] rounded-md mx-auto" />
              <FileUpload setPicture={setPicture} buttonText="Upload Picture" className="mx-auto mb-[1px]" limitInMegabytes={5} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="flex text-md font-medium text-gray-900">
              Description:
              <p className="text-red-600">*</p>
            </span>
            <div>
              <ReactQuill value={description} onChange={setDescription} theme="snow" style={{ height: '200px' }}>
                <div
                  className="ql-editor"
                  style={{ fontSize: '17px', borderRadius: "0px 0px 10px 10px", background: "#ece9e4", padding: 0, fontFamily: 'Georgia, serif' }}
                />
              </ReactQuill>
            </div>
          </div>

          <div className="mt-8 sm:w-96">
            <FormInput text="Reference link:" value={link} onChange={(e) => setLink(e.target.value)} className="!text-blue-700 !border-gray-300" />
          </div>
        </div>

        <div className="-mt-4 flex justify-between">
          <div className="mt-7 text-md font-medium flex text-gray-600">
            <span className="text-red-600">*</span>
            Required fields.
          </div>
          <div className="flex flex-col items-center">
            <div className="ml-auto">
              <FormButton text="Preview Article" className="!w-52" onClick={previewArticle} />
            </div>
            <div className="-mt-4 ml-auto">
              <FormButton text="Submit Article" className="!w-52" onClick={submitArticle} loading={loading} />
            </div>
            <p className="text-red-600 mt-1">{errorMessage}</p>
          </div>
        </div>
      </div>
    </Page>
  );
}