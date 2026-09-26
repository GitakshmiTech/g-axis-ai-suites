import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "w-full py-3 rounded-lg font-bold text-center transition-colors text-sm focus:outline-none";
  
  const variants = {
    primary: "bg-primary text-white-100 hover:bg-blue-800",
    outline: "bg-gray border border-stroke text-black-90 hover:bg-stroke/50"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};
