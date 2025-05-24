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
  const [tags, addTag] = useState([]);
  const [picture, setPicture] = useState(null);
  const [description, setDescription] = useState("");

  const [tagInput, setTagInput] = useState("");

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

  const submitArticle = async () => {
    if (!(title && description && tags)) return; // da se odradi error za ovo

    const article = {
      title: title,
      content: description,
      category: "Tech", // kategorija nzm zasto postoji kad postoje tagovi
      tags: tags.join('|'),
      photos: picture ? [URL.createObjectURL(picture)] : [], // slika nzm kako se cuva
      link: "", // ne znam sta je ovo
      author: contextUser?.username, // treba ime i prezime umesto ovoga
      score: 0,
      upvoted: false,
      downvoted: false,
      bookmarked: false
    }

    await axios.post(`${APIUrl}NewsArticle/AddNewsArticle`, article, {
      headers: {
        Authorization: `Bearer ${contextUser.jwtToken}`,
        'Content-Type': 'application/json'
      }
    }).then(result => {
      console.log(result.data);
    }).catch(error => {
      console.log(error);
    });
  }

  return (
    <Page loading={true}>
      <div className="mt-2 px-10 flex flex-col">
        <div className="flex flex-col gap-6">
          <FormInput text="Title:" required value={title} onChange={(e) => setTitle(e.target.value)} className="!text-xl !border-gray-300" />
          <div className="grid grid-cols-3 gap-6">
            <div className="px-2 border border-gray-300 rounded-md col-span-1">
              <FormInput text="Tags:" required value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={onKeyDown} className="mb-2 !border-gray-300" />
              <div className="flex flex-wrap gap-2 mt-2 max-h-60 overflow-y-auto">
                {tags.map((tag, idx) => (
                  <Tag key={idx} text={tag}
                    onClick={() => addTag(tags.filter((_, i) => i !== idx))}
                    displayOnly={false}
                  />
                ))}
              </div>
            </div>

            <div className="col-span-2 flex flex-col p-2 border border-gray-300 rounded-md">
              <img src={picture ? URL.createObjectURL(picture) : null} className="h-64 rounded-md mx-auto" />
              <FileUpload setPicture={setPicture} buttonText="Upload Picture" className="mx-auto" limitInMegabytes={5} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="flex text-md font-medium text-gray-900">
              Description:
              <p className="text-red-600">*</p>
            </span>
            <div>
              <ReactQuill value={description} onChange={setDescription} theme="snow" style={{ height: "200px" }} />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <p className="text-md font-medium flex mt-4 text-gray-600">
            <span className="text-red-600">*</span>
            Required fields.
          </p>
          <FormButton text="Submit Article" className=" w-64" onClick={submitArticle} />
        </div>
      </div>
    </Page>
  );
}