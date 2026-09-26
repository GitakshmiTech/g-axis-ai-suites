import React from 'react';

export const QuoteIcon = ({ size = 45, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size * 0.8} 
      viewBox="0 0 55 45" 
      fill="currentColor" 
      className={className}
    >
      <path d="M21 0H0V25H12L5 45H17L24 25V0H21ZM52 0H31V25H43L36 45H48L55 25V0H52Z" />
    </svg>
  );
};
