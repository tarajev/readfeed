import { useEffect, useState, useMemo, useCallback } from "react";
import ArticleDisplay from "./ArticleDisplay";

export default function SlidingPanel({ children, removeFromSlidingPanel }) {
  const [open, setOpen] = useState(false);
  const memoizedChildren = useMemo(() => children, [children]);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(memoizedChildren);
  }, [memoizedChildren])

  return (
    <div
      className={`fixed top-[110px] right-0 h-screen lg:w-96 sm:w-1/2 bg-[#ECE9E4] drop-shadow-[0_5px_5px_rgba(0,0,0,0.35)] text-white p-4 transform ${open ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 shadow-xl`}
      style={{ height: `calc(100vh - 150px)` }}
    >
      {/* Dugme za otvaranje/zatvaranje - pomera se zajedno sa panelom */}
      <button
        onClick={() => setOpen(!open)}
        className={`absolute top-1/2 transform -translate-y-1/2 bg-[#BF2734] text-white px-4 py-2 rounded-l-lg !drop-shadow-none transition-transform duration-300 ${open ? "left-[-70px]" : "left-[-100px]"
          }`}
      >
        {open ? "Close" : "Read Later "}
      </button>

      {/* Sadržaj panela */}
      <h3 className="text-center text-accent font-playfair text-lg p-2">Read Later</h3>
      {data ? (
        <div className="overflow-y-auto max-h-full flex flex-1 flex-col justify-items-center gap-4 ml-4 pb-14">{data.map((article) => ( 
          < ArticleDisplay className="!max-w-full !shadow-sm border-2 border-accent/40" key={article.id} article={{ ...article, bookmarked: true }} removeFromReadLaterSection={removeFromSlidingPanel}></ArticleDisplay>
        ))}</div>
      ) : (<div></div>)}
    </div>
  );
}
