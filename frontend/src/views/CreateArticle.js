import { useState } from "react";
import { FileUpload, FormButton, FormInput, Page } from "../components/BasicComponents";
import Tag from "../components/Tag";

export default function ArticlePage() {
  const [tagInput, setTagInput] = useState("");
  
  const [title, setTitle] = useState("");
  const [tags, addTag] = useState([]);
  const [picture, setPicture] = useState(null);
  const [description, setDescription] = useState("");

  const onKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      addTag((prev) => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  }

  return (
    <Page loading={true}>
      <div className="pt-5 px-10 flex flex-col">
        <div>
          <FormInput text="Title:" className="!border-gray-300" />
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1">
              <FormInput value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={onKeyDown} text="Tags:" className="mb-2 !border-gray-300" />
              <div className="flex flex-wrap gap-2 mt-2 max-h-60 overflow-y-auto">
                {tags.map((tag, idx) => (
                  <Tag key={idx} text={tag}
                    onClick={() => addTag(tags.filter((_, i) => i !== idx))}
                    displayOnly={false}
                  />
                ))}
              </div>
            </div>

            <div className="col-span-2 flex flex-col mt-2 p-2 border border-gray-300 rounded-md">
              <img src={picture ? URL.createObjectURL(picture) : ""} className="h-64 rounded-md mx-auto" />
              <FileUpload setPicture={setPicture} buttonText="Upload Picture" className="mx-auto" limitInMegabytes={5} />
            </div>
          </div>
          <FormInput text="Description:" multiline rows={10} className="!border-gray-300" />
        </div>

        <div>
          <div className="ml-auto w-64">
            <FormButton text="Submit Article" />
          </div>
        </div>
      </div>
    </Page>
  );
}