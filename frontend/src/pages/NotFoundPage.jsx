import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
        <Compass className="w-10 h-10 animate-spin-slow" />
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="font-display font-extrabold text-4xl text-slate-900">404 - Page Not Found</h1>
        <p className="text-sm text-slate-500">
          The page you are looking for doesn't exist or has been moved.
        </p>
      </div>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/25 transition-all"
      >
        <Home className="w-4 h-4" /> Back to Home Page
      </Link>
    </div>
  );
};
