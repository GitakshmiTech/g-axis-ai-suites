import React from 'react';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Link } from 'react-router-dom';

export const ForgotPassword = () => {
  return (
    <AuthLayout>
      <div className="flex flex-col pt-[40px] px-[48px] pb-[72px] gap-[20px] ">
        
        {/* Form Header */}
        <div className="text-center">
          <h2 className="text-[32px] font-bold text-black-90">Forgot Password</h2>
          <p className="text-sm font-medium mt-2 text-black-90/60">
            Enter your registered email
          </p>
        </div>

        {/* Form Fields */}
        <form className="flex flex-col gap-2 w-full">
          <Input 
            label="Email" 
            type="email" 
            placeholder="Enter your email" 
          />
          
          {/* Buttons */}
          <div className="flex flex-col gap-4 mt-2">
            <Button type="button" variant="primary">
              Send Reset Link
            </Button>
            
            {/* OR separator */}
            <div className="flex items-center gap-4">
              <div className="h-[1px] bg-stroke flex-1"></div>
              <span className="text-sm font-bold text-black-90/50">OR</span>
              <div className="h-[1px] bg-stroke flex-1"></div>
            </div>

            <Button type="button" variant="outline">
              Sign in with SSO
            </Button>
          </div>
        </form>

        {/* Back Link */}
        <div className="text-center mt-2">
          <span className="text-sm font-bold text-black-90">Back to </span>
          <Link to="/" className="text-sm font-bold text-secondary hover:underline">
            Sign in
          </Link>
        </div>

      </div>
    </AuthLayout>
  );
};
