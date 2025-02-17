import React, { useState, useContext } from 'react'
import AuthorizationContext from '../context/AuthorizationContext'
import Select from "react-select";

export default function DrawAddInterests() {
    const { APIUrl, contextUser } = useContext(AuthorizationContext)

    return (<>
        <div>
            <Select
                id="tagsDropdown"
                options={tagsOptions}
                isMulti
                value={tagsOptions.filter((option) => selectedTags.includes(option.value))}
                onChange={handleDropdownChange}
                placeholder="Choose genres..."
                className="border-violet-800 border-4 rounded-2xl"
                styles={{
                    control: (provided, state) => ({
                        ...provided,
                        borderRadius: "0.5rem",
                        border: "#5b21b6",
                        backgroundColor: "#111827",
                        width: "100%"
                    }),
                    option: (provided, state) => ({
                        ...provided,
                        "&:hover": {
                            backgroundColor: "#5b21b6",
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
        </div>

    </>);

}