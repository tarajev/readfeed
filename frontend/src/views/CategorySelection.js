import { useContext, useState, useEffect } from "react";
import AuthorizationContext from "../context/AuthorizationContext";
import { useNavigate } from "react-router-dom";
import { Page } from "../components/BasicComponents";
import Tag from "../components/Tag";
import { FormButton } from "../components/BasicComponents";
import axios from "axios";

export const ARTICLE_CATEGORIES = [
  "Politics", "Technology", "Science", "Art", "Sports", "Music", "Travel", "Food", "Health", "Business", "Environment",
  "Education", "Culture", "Finance", "Entertainment", "Lifestyle", "Automotive", "Fashion", "Gaming", "World"
];

export default function CategorySelectionPage() {
  const { contextUser, contextSetUser, APIUrl } = useContext(AuthorizationContext);
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("ReadfeedUser") || "{}");

    if (userData?.subscribedCategories?.length >= 3) {
      navigate("/", { replace: true });
    }
  }, []);

  function toggleCategory(cat) {
    if (selected.includes(cat)) {
      setSelected(selected.filter(c => c !== cat));
    }
    else {
      setSelected([...selected, cat]);
    }
  }

  async function accept() {
    if (selected.length < 3) return;

    axios.put(`${APIUrl}User/SubscribeUserToCategories/${contextUser.username}`, selected, {
      headers: {
        Authorization: `Bearer ${contextUser.jwtToken}`,
        'Content-Type': 'application/json'
      },
    })
      .then(() => {
        const updatedUser = { ...contextUser, subscribedCategories: selected };
        contextSetUser(updatedUser);
        localStorage.setItem("ReadfeedUser", JSON.stringify(updatedUser));
        navigate("/");
      })
      .catch((error) => {
        console.error("Error subscribing to categories:", error);
      });
  }

  return (
    <Page>
      <div className="flex flex-col mt-20 items-center gap-4 font-serif">
        <h1 className="text-2xl">Choose at least 3 categories you want to follow</h1>
        <div className="flex flex-wrap p-4 justify-center gap-2 text-xl">
          {ARTICLE_CATEGORIES.map((cat) => (
            <div
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`cursor-pointer hover:shadow-md hover:rounded-xl hover:opacity-100 select-none ${selected.includes(cat) ? "opacity-100" : "opacity-50"}`}
            >
              <Tag className={selected.includes(cat) ? "!bg-[#a9222f] !text-white" : ""} text={cat} displayOnly={true} />
            </div>
          ))}
        </div>
        <FormButton
          text="Accept"
          disabled={selected.length < 3}
          onClick={accept}
          loading={false}
          className="!text-2xl !px-10"
        />
      </div>
    </Page>
  );
}
