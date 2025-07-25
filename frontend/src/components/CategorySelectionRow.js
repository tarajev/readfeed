import { useState, useContext, useEffect } from 'react'
export function CategorySelectionRow({ category, filtered, alreadySubscribed, addCategory, removeCategory, subscribe, unsubscribe }) {
    const [checked, setChecked] = useState(filtered);
    const [subscribed, setSubscribed] = useState(alreadySubscribed);

    const onSubscribe = (categoryName) => {
        if (!subscribed) {
            subscribe(categoryName);
            setSubscribed(prev => !prev);
        } else {
            const success = unsubscribe(categoryName);
            if (!success) return;
            else setSubscribed(prev => !prev);
        }
    };

    const onChecked = (categoryName) => {
        if (!checked)
            addCategory(categoryName);
        else
            removeCategory(categoryName);

        setChecked(prev => !prev);
    }

    return (<>
        <div className='grid grid-cols-3 gap-4 justify-between ml-3 mb-2'>
            <input style={{ accentColor: 'red' }} className="w-4 h-4" id="default-checkbox" type="checkbox" checked={checked} value={checked} onChange={() => onChecked(category)}></input>
            <label>{category}</label>
            <button className={"p-1 bg-transparent text-accent round-md hover:underline"} onClick={() => onSubscribe(category)}>{subscribed ? "Unsubcribe" : "Subscribe"}</button>
        </div>
    </>)
}