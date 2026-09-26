import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@gmail.com' && password === 'admin123') {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Use admin@gmail.com / admin123');
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col pt-[40px] px-[48px] pb-[72px] gap-[30px]">
        
        {/* ================================================================================================================== */}
        {/*    Form Header */}
        {/* ================================================================================================================== */}
        <div className="text-center">
          <h2 className="text-[32px] font-bold text-black-90">Sign in to your account</h2>
          <p className="text-sm font-medium mt-2 text-black-90/60">
            Welcome back! Please enter your details.
          </p>
        </div>

        {/* Form Fields */}
        <form className="flex flex-col gap-3 w-full" onSubmit={handleLogin}>
          <Input 
            label="Email" 
            type="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <Input 
            label="Password" 
            type="password" 
            placeholder="Enter your password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-alert text-sm font-medium">{error}</p>}

          {/* Remember Me */}
          <div className="flex items-center gap-2 mt-1">
            <input 
              type="checkbox" 
              id="remember" 
              className="w-4 h-4 rounded border-stroke text-primary focus:ring-primary cursor-pointer" 
            />
            <label htmlFor="remember" className="text-sm font-bold text-black-90 cursor-pointer select-none">
              Remember me
            </label>
          </div>

          {/* ================================================================================================================== */}
          {/*    Buttons */}
          {/* ================================================================================================================== */}
          <div className="flex flex-col gap-3 mt-1">
            <Button type="submit" variant="primary">
              Sign in
            </Button>
            <Button type="button" variant="outline">
              Sign in with SSO
            </Button>
          </div>
        </form>

      </div>
    </AuthLayout>
  );
};
