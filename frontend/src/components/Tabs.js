import React, { useState } from 'react'
import '../assets/tabs.css';

export default function Tabs({ preventTab, DrawTab1, DrawTab2 }) {
    const [toggleState, setToggleState] = useState(1);

    const toggleTab = (index) => {
        setToggleState(index);
    };

    return (
        <div className="container">
            <div className="bloc-tabs ">
                <button
                    tabIndex={preventTab ? -1 : 0}
                    className={toggleState === 1 ? "tabs active-tabs" : "tabs"}
                    onClick={() => toggleTab(1)}
                >
                    <span className="text">News Feed</span>
                </button>
                <button
                    tabIndex={preventTab ? -1 : 0}
                    className={toggleState === 2 ? "tabs active-tabs" + " place-items-center" : "tabs" + " place-items-center"}
                    onClick={() => toggleTab(2)}
                >
                    <div className="flex place-items-center gap-1">
                        <span className="text ">Live Now</span>
                        <span className="bg-[#BF2734] w-2.5 h-2.5 rounded-full"></span>
                    </div>
                </button>
            </div>
            <div className="content-tabs">
                <div className={toggleState === 1 ? "content  active-content" : "content"}>
                    <DrawTab1 />
                </div>

                <div className={toggleState === 2 ? "content  active-content" : "content"}>
                    <DrawTab2 />
                </div>
            </div>
        </div>
    );
}


