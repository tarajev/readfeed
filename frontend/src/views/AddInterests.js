import React, { useState, useContext, useEffect } from 'react'
import AuthorizationContext from '../context/AuthorizationContext'
import Select from "react-select";
import Tag from '../components/Tag';
import { Exit } from '../components/BasicComponents';

//TODO
export default function DrawAddInterests({ onClose, onChange, existingTags }) {
    const { APIUrl, contextUser } = useContext(AuthorizationContext)
    const [tagsOptions, setTagsOptions] = useState([]);
    const [selectedTags, setSelectedTags] = useState(existingTags);

    const handleDropdownChange = (selectedOption) => {
        setSelectedTags(prevSelected => {
            const newSelected = [...prevSelected, selectedOption.value];
            onChange(newSelected);
            return newSelected;
        });
        setTagsOptions(prevOptions => prevOptions.filter(tag => tag.value != selectedOption.value));
    };

    const handleTagClick = (tag) => {
        setSelectedTags(prevSelectedTags => {
            const newSelected = prevSelectedTags.filter(t => t !== tag);
            onChange(newSelected);
            return newSelected;
        })
        setTagsOptions(prevTagsOptions => [...prevTagsOptions, { value: tag, label: tag }]);
    };

    useEffect(() => {
        const filteredTags = contextUser.subscribedCategories
            .filter(tag => !selectedTags.includes(tag))
            .map(tag => ({ value: tag, label: tag }));

        setTagsOptions(filteredTags);
    }, []);

    return (<>
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
            <div className="max-w-lg bg-white h-xs mx-auto my-auto flex flex-col px-5 py-2 pb-7 shadow-lg rounded-md">
                <Exit
                    blue
                    className="ml-auto text-sm w-5 mb-2"
                    onClick={onClose}
                />
                <Select
                    id="tagsDropdown"
                    options={tagsOptions}
                    //isMulti
                    value={null}
                    onChange={handleDropdownChange}
                    placeholder="Choose interests..."
                    className="border-accent border-4 rounded-2xl mb-3"
                    styles={{
                        control: (provided, state) => ({
                            ...provided,
                            borderRadius: "0.75rem",
                            border: "#5b21b6",
                            backgroundColor: "secondary",
                            width: "100%"
                        }),
                        option: (provided, state) => ({
                            ...provided,
                            "&:hover": {
                                backgroundColor: "#ECE9E4",
                            },
                        }),
                        multiValue: (provided) => ({
                            ...provided,
                            backgroundColor: "#5b21b6", // Pozadina taga
                        }),
                        multiValueLabel: (provided) => ({
                            ...provided,
                            color: "white", // Tekst taga
                        }),
                    }}
                />
                <div className='flex flex-wrap w-fit'>
                    {selectedTags.map((tag, index) => (
                        <Tag key={index} text={tag} onClick={() => handleTagClick(tag)}></Tag>
                    ))}
                </div>
            </div>
        </div>

    </>);

}