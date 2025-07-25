import React, { useState, useContext, useEffect } from 'react'
import AuthorizationContext from '../context/AuthorizationContext'
import Select from "react-select";
import Tag from '../components/Tag';
import { Exit, FormButton } from '../components/BasicComponents';
import { ARTICLE_CATEGORIES } from '../views/CategorySelection'
import { CategorySelectionRow } from '../components/CategorySelectionRow';
import axios from 'axios';

//TODO
export default function DrawAddInterests({ onClose, onChange, existingTags }) {
    const { contextUser, contextSetUser, APIUrl } = useContext(AuthorizationContext);
    const [selectedTags, setSelectedTags] = useState(existingTags);
    const [categories, setCategories] = useState(ARTICLE_CATEGORIES);
    const [subscriptions, setSubscriptions] = useState([]);
    const [removeSubscriptions, setRemoveSubscriptions] = useState([]);

    const handleAddTag = (selectedOption) => {
        setSelectedTags(prevSelected => {
            const newSelected = [...prevSelected, selectedOption];
            //onChange(newSelected);
            return newSelected;
        });
        //setTagsOptions(prevOptions => prevOptions.filter(tag => tag.value != selectedOption.value));
    };

    const subscribeUserToCategories = async (newSelectedCategories) => {
        axios.put(`${APIUrl}User/SubscribeUserToCategories/${contextUser.username}`, newSelectedCategories, {
            headers: {
                Authorization: `Bearer ${contextUser.jwtToken}`,
                'Content-Type': 'application/json'
            },
        })
            .then(() => {
                const updatedUser = {
                    ...contextUser, subscribedCategories: Array.from(new Set([
                        ...contextUser.subscribedCategories,
                        ...newSelectedCategories
                    ]))
                };
                contextSetUser(updatedUser);
                localStorage.setItem("ReadfeedUser", JSON.stringify(updatedUser));
            })
            .catch((error) => {
                console.error("Error subscribing to categories:", error);
            });
    }

    const unsubscribeUserToCategories = async (categoriesToRemove) => {
        axios.put(`${APIUrl}User/UnsubscribeUserFromCategories/${contextUser.username}`, categoriesToRemove, {
            headers: {
                Authorization: `Bearer ${contextUser.jwtToken}`,
                'Content-Type': 'application/json'
            },
        })
            .then(() => {
                const updatedUser = {
                    ...contextUser, subscribedCategories: contextUser.subscribedCategories.filter(
                        (category) => !categoriesToRemove.includes(category)
                    )
                }
                contextSetUser(updatedUser);
                localStorage.setItem("ReadfeedUser", JSON.stringify(updatedUser));
            })
            .catch((error) => {
                console.error("Error unsubscribing to categories:", error);
            });
    }



    const handleRemoveTag = (tag) => {
        setSelectedTags(prevSelectedTags => {
            const newSelected = prevSelectedTags.filter(t => t !== tag);
            //onChange(newSelected);
            return newSelected;
        })
        // setTagsOptions(prevTagsOptions => [...prevTagsOptions, { value: tag, label: tag }]);
    };

    const addToSubscriptions = (category) => {
        setSubscriptions(prev => [...prev, category]);
    }

    const removeFromSubscriptions = (category) => {
        const currentlySubscribed = contextUser.subscribedCategories;
        const futureUnsubscribed = [...removeSubscriptions, category];
        const futureSubscribed = currentlySubscribed.filter(cat => !futureUnsubscribed.includes(cat));

        if (futureSubscribed.length + subscriptions.length < 3) {
            alert("You must stay subscribed to at least 3 categories.");
            return false;
        }
        else {
            setRemoveSubscriptions(prev => [...prev, category]);
            return true;
        }
    };

    const handleSaveChanges = async () => {
        if (subscriptions.length > 0) {
            await subscribeUserToCategories(subscriptions)
            setSubscriptions([]);
        }
        if (removeSubscriptions.length > 0) {
            await unsubscribeUserToCategories(removeSubscriptions)
            setRemoveSubscriptions([]);
        }
        onChange(selectedTags);
        onClose();
    }

    return (<>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
            <div className="max-w-lg bg-white h-xs mx-auto my-auto flex flex-col px-5 py-2 pb-7 shadow-lg rounded-md">
                <Exit
                    blue
                    className="ml-auto text-sm w-5 mb-2"
                    onClick={onClose} />
                <div className='grid h-60 overflow-y-auto px-1'>
                    <div className=' grid grid-cols-3 gap-4 sticky top-0 py-2 items-center font-semibold bg-white text-gray-600 px-1 mb-2'>
                        <span>Show</span>
                        <span>Category</span>
                        <span>Subscription</span>
                    </div>
                    {categories.map((name, index) => (
                        <CategorySelectionRow key={index} category={name} filtered={selectedTags.includes(name)} alreadySubscribed={contextUser.subscribedCategories.includes(name)} removeCategory={handleRemoveTag} addCategory={handleAddTag} subscribe={addToSubscriptions} unsubscribe={removeFromSubscriptions}></CategorySelectionRow>
                    ))}
                </div>
                <div className="mx-auto">
                    <FormButton text="Confirm Changes" className="!w-52" onClick={() => handleSaveChanges()} />
                </div>
            </div>
        </div>

    </>);

}