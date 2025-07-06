import { useState, useEffect, useRef } from 'react';
import { Link } from '../components/BasicComponents';
import Tooltip from '../components/Tooltip';

export default function BurgerMenu({ preventTab, icon, white, size, xOffset, yOffset, className, listItemArray, grouped, hoverText }) {
  const [burgerClicked, setBurgerClicked] = useState(false);
  const formRef = useRef(null);

  if (!listItemArray) console.log("BurgerMenu doesn't have any items. Add items to display the menu correctly.");

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

  const toggleBurgerClicked = () => {
    setBurgerClicked(!burgerClicked);
  };

  return (
    <div ref={formRef} className={`w-fit inline-flex${className}`}>
      <a
        tabIndex={preventTab ? -1 : 0}
        className='outline-gray-400 p-1 flex items-center'
        href="#"
        onClick={toggleBurgerClicked}
      >
        <Tooltip text={hoverText} hideOn={burgerClicked}>
          <img
            tabIndex={-1}
            src={icon}
            className={`h-${size} w-${size} outline-none ${white ? 'filter-white' : ''}`}
          />
        </Tooltip>
      </a>
      {listItemArray && burgerClicked && (
        <div
          className={`absolute right-0 z-20 py-1 w-48 bg-[#a9222f] rounded-md shadow-xl fade-in`}
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
                    className='block px-4 py-2 text-md text-gray-400 item'
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
                className='block px-4 py-2 text-md text-gray-400 item'
              >
                {item.name}
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}