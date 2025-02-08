import React, { useState, useEffect, useRef } from 'react';
import { Link } from '../components/BasicComponents';
import Tooltip from '../components/Tooltip';

export default function BurgerMenu({ preventTab, icon, filter, size, xOffset, yOffset, className, listItemArray, grouped, hoverText }) {
  const [burgerClicked, setBurgerClicked] = useState(false);
  const formRef = useRef(null);

  useEffect(() => { // Klik van komponente
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setBurgerClicked(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!listItemArray) {
    console.log("BurgerMenu doesn't have any items. Add items to display the menu correctly.");
  }

  const toggleBurgerClicked = () => {
    setBurgerClicked(!burgerClicked);
  };

  return (
    <div ref={formRef} className={`w-fit inline-flex${className}`}>
      <a
        tabIndex={preventTab ? -1 : 0}
        className='outline-indigo p-1 flex items-center'
        href="#"
        onClick={toggleBurgerClicked}
      >
        <Tooltip text={hoverText} hideOn={burgerClicked}>
          <img
            tabIndex={-1}
            src={icon}
            className={`h-${size} w-${size} outline-none ${filter ? 'filter-indigo' : ''}`}
          />
        </Tooltip>
      </a>
      {listItemArray && burgerClicked && (
        <div
          className={`absolute -translate-x-36 sm:translate-x-0 z-20 py-1 w-48 bg-indigo-600 rounded-md shadow-xl fade-in`}
          style={{ marginTop: `${yOffset * 4}px`, marginLeft: `${xOffset}px` }}
        >
          {grouped
            ? listItemArray.map((group, groupIndex) => (
              <div key={groupIndex}>
                {group.label && (
                  <div className={`px-4 text-md font-semibold ${groupIndex === 0 ? 'border-b' : 'border-y'} border-gray-300 bg-gray-100`}>
                    {group.label}
                  </div>
                )}
                {group.items.map((item, itemIndex) => (
                  <Link
                    key={itemIndex}
                    route={item.route}
                    param={item.param}
                    onClick={item.onClick}
                    className='block px-4 py-2 text-md text-gray-700 item'
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            ))
            : listItemArray.map((item, index) => (
              <Link
                key={index}
                route={item.route}
                param={item.param}
                onClick={item.onClick}
                className='block px-4 py-2 text-md text-gray-700 item'
              >
                {item.name}
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
