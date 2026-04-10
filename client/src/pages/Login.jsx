import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import BlurCircle from '../components/BlurCircle';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (user) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-[80vh] relative px-6'>
      <BlurCircle top='10%' left='-10%' />
      <BlurCircle bottom='10%' right='-10%' />
      
      <div className='bg-white/10 backdrop-blur-md p-10 rounded-2xl border border-gray-300/20 max-w-md w-full z-10'>
        <h2 className='text-3xl font-bold mb-6 text-center'>Welcome Back</h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div>
            <label className='block mb-1 text-sm text-gray-300'>Email</label>
            <input 
              type='email' 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className='w-full px-4 py-2 bg-black/50 rounded-lg border border-gray-700 focus:outline-none focus:border-primary text-white'
              placeholder='Enter your email'
            />
          </div>
          <div>
            <label className='block mb-1 text-sm text-gray-300'>Password</label>
            <input 
              type='password' 
              required 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className='w-full px-4 py-2 bg-black/50 rounded-lg border border-gray-700 focus:outline-none focus:border-primary text-white'
              placeholder='Enter your password'
            />
          </div>
          <button 
            type='submit' 
            className='w-full mt-4 bg-primary hover:bg-primary-dull transition py-2 rounded-lg font-semibold'
          >
            Login
          </button>
        </form>
        <p className='mt-6 text-center text-sm text-gray-400'>
          Don't have an account? <Link to='/register' className='text-primary hover:underline'>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
