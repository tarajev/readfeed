import { useState } from "react";

export default function SlidingPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`fixed top-[110px] right-0 h-screen lg:w-80 sm:w-1/2 bg-[#ECE9E4] drop-shadow-[0_5px_5px_rgba(0,0,0,0.35)] text-white p-4 transform ${
        open ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 shadow-xl`}
      style={{ height: `calc(100vh - 150px)` }}
    >
      {/* Dugme za otvaranje/zatvaranje - pomera se zajedno sa panelom */}
      <button
        onClick={() => setOpen(!open)}
        className={`absolute top-1/2 transform -translate-y-1/2 bg-[#BF2734] text-white px-4 py-2 rounded-l-lg !drop-shadow-none transition-transform duration-300 ${
          open ? "left-[-70px]" : "left-[-100px]"
        }`}
      >
        {open ? "Close" : "Read Later "}
      </button>

      {/* Sadržaj panela */}
      <div>Sadrzaj</div>
    </div>
  );
}
