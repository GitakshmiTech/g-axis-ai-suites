import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Input = ({ label, type = 'text', placeholder, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center">
        <label className="text-sm font-bold text-black-90">{label}</label>
        {isPassword && (
          <Link to="/forgot-password" className="text-sm font-bold text-secondary hover:underline">
            Forgot password?
          </Link>
        )}
      </div>
      <div className="relative w-full">
        <input 
          type={isPassword && showPassword ? 'text' : type} 
          placeholder={placeholder} 
          className="w-full px-4 py-3 bg-gray border border-stroke rounded-lg focus:outline-none focus:border-primary text-sm font-medium placeholder:text-black-90/50"
          {...props}
        />
        {isPassword && (
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-primary hover:text-blue-800 focus:outline-none"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};
