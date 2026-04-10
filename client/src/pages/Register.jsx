import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import BlurCircle from '../components/BlurCircle';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(name, email, password);
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className='flex items-center justify-center min-h-[80vh] relative px-6 mt-10'>
      <BlurCircle top='20%' left='-5%' />
      <BlurCircle bottom='20%' right='-5%' />
      
      <div className='bg-white/10 backdrop-blur-md p-10 rounded-2xl border border-gray-300/20 max-w-md w-full z-10'>
        <h2 className='text-3xl font-bold mb-6 text-center'>Create Account</h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div>
            <label className='block mb-1 text-sm text-gray-300'>Full Name</label>
            <input 
              type='text' 
              required 
              value={name}
              onChange={e => setName(e.target.value)}
              className='w-full px-4 py-2 bg-black/50 rounded-lg border border-gray-700 focus:outline-none focus:border-primary text-white'
              placeholder='Enter your name'
            />
          </div>
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
              placeholder='Create a password'
            />
          </div>
          <button 
            type='submit' 
            className='w-full mt-4 bg-primary hover:bg-primary-dull transition py-2 rounded-lg font-semibold'
          >
            Sign Up
          </button>
        </form>
        <p className='mt-6 text-center text-sm text-gray-400'>
          Already have an account? <Link to='/login' className='text-primary hover:underline'>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
