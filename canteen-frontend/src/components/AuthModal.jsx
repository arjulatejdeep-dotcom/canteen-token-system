import React, { useState, useEffect } from 'react';
import { X, Zap, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('ROLE_STUDENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPassword('');
      setName('');
      setError('');
    }
  }, [isOpen]);

  const handleModalClose = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegister) {
        await register(name.trim(), email.trim().toLowerCase(), password, role);
      } else {
        await login(email.trim().toLowerCase(), password);
      }
      handleModalClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillStudentCredentials = () => {
    setIsRegister(false);
    setEmail('student@campus.edu');
    setPassword('password123');
    setError('');
  };

  const fillStaffCredentials = () => {
    setIsRegister(false);
    setEmail('staff@campus.edu');
    setPassword('password123');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl relative animate-scale-up">
        
        <button
          onClick={handleModalClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-xl hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <h3 className="text-xl font-black text-slate-900">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {isRegister ? 'Sign up to start ordering from the canteen' : 'Enter your credentials to sign in'}
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 mb-5">
          <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between mb-2">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-blue-600" /> Autofill Demo Credentials
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Fills form</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillStudentCredentials}
              className="bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold py-2 rounded-xl border border-slate-200 shadow-2xs transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={fillStaffCredentials}
              className="bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold py-2 rounded-xl border border-slate-200 shadow-2xs transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              👨‍🍳 Canteen Staff
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Tejdeep"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-blue-600"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@campus.edu"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-10 py-2 text-xs font-semibold text-slate-900 focus:outline-blue-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-blue-600"
              >
                <option value="ROLE_STUDENT">Student</option>
                <option value="ROLE_STAFF">Canteen Staff</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-xs disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : isRegister ? 'Register Account' : 'Sign In with Credentials'}
          </button>
        </form>

        <div className="text-center mt-4 text-xs text-slate-500">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-blue-600 font-bold hover:underline cursor-pointer"
          >
            {isRegister ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

      </div>
    </div>
  );
}
