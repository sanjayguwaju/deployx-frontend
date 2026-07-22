import React from 'react';
import { Outlet, Link } from 'react-router';

const MarketingLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col font-satoshi bg-white dark:bg-boxdark-2">
      {/* Navbar */}
      <header className="border-b border-gray-100 dark:border-strokedark bg-white dark:bg-boxdark sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-600 rounded flex items-center justify-center">
                  <span className="text-white text-xl leading-none">D</span>
                </div>
                Deploy<span className="text-brand-600">X</span>
              </Link>
            </div>

            {/* Nav Links - Desktop */}
            <nav className="hidden md:flex space-x-8">
              <Link to="/features" className="text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition">Features</Link>
              <Link to="/how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition">How it Works</Link>
              <Link to="/pricing" className="text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition">Pricing</Link>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link to="/auth/signin" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition">
                Sign In
              </Link>
              <Link to="/register" className="bg-brand-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-brand-700 transition shadow-sm">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-boxdark border-t border-gray-200 dark:border-strokedark pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white mb-4 block">DeployX</Link>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                Modernizing Global Manpower Recruitment. The AI-powered CRM built for agencies to scale faster.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-3">
                <li><Link to="/features" className="text-gray-500 hover:text-brand-600 transition">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-500 hover:text-brand-600 transition">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><Link to="/terms" className="text-gray-500 hover:text-brand-600 transition">Terms of Service</Link></li>
                <li><Link to="/privacy" className="text-gray-500 hover:text-brand-600 transition">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-strokedark pt-8 text-center md:text-left text-gray-500 text-sm flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} DeployX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketingLayout;
