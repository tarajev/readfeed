import React, { useState, useEffect } from 'react';

export default function Tooltip({ text, hideOn, top, children }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (hideOn)
      setVisible(false);
  }, [hideOn]);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)} 
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && text && (
        <div 
          className={`absolute ${top ? 'bottom-full' : ''} left-1/2 transform -translate-x-1/2 mt-2 w-40 fade-in bg-[#f4f1ec] text-gray-600 hover:text-gray-400 text-center text-sm rounded py-2 px-3 shadow-lg`}
          style={{ marginTop: top ? '0rem' : '0.5rem', marginBottom: top ? '1rem' : '0' }}
        >
          <p className='truncate'>{text}</p>
          <div 
            className={`absolute ${top ? '' : 'bottom-full'} left-1/2 transform -translate-x-1/2 w-3 h-3 ${top ? 'mt-0.5' : '-mb-2'} bg-[#f4f1ec] border-${top ? 'b' : 't'} border-${top ? 'r' : 'l'} border-gray-950 rotate-45`}
          ></div>
        </div>
      )}
    </div>
  );
}
