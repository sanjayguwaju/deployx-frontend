import { useState } from "react";
import { Link, Outlet } from "react-router";
import { Server, Menu, X, ChevronDown } from "lucide-react";

export default function MarketingLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                  <Server className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Deploy<span className="text-brand-500">X</span></span>
              </Link>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="relative group">
                <button className="flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Product <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="py-2">
                    <Link to="/features" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">Features</Link>
                    <Link to="/how-it-works" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">How it Works</Link>
                    <Link to="/pricing" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">Pricing</Link>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <button className="flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                  Resources <ChevronDown className="ml-1 w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="py-2">
                    <Link to="/docs" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">Documentation</Link>
                    <Link to="/api-reference" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">API Reference</Link>
                    <Link to="/community" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">Community Guide</Link>
                  </div>
                </div>
              </div>
              <Link to="/contact" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                Contact
              </Link>
              <Link to="/candidate/track" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2 text-sm font-medium transition-colors">
                Candidate Portal
              </Link>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/signin" className="text-gray-900 bg-gray-100 hover:bg-gray-200 dark:text-white dark:bg-gray-800 dark:hover:bg-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors shadow-sm shadow-brand-500/20">
                Register Agency
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-2"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div className={`fixed inset-y-0 right-0 z-70 w-72 bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900 dark:text-white">Deploy<span className="text-brand-500">X</span></span>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          <div className="space-y-1">
            <button 
              onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
              className="w-full flex justify-between items-center px-3 py-3 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Product
              <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isFeaturesOpen ? 'rotate-180' : ''}`} />
            </button>
            {isFeaturesOpen && (
              <div className="pl-6 space-y-1 mt-1">
                <Link to="/features" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">Features</Link>
                <Link to="/how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">How it Works</Link>
                <Link to="/pricing" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">Pricing</Link>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <button 
              onClick={() => setIsResourcesOpen(!isResourcesOpen)}
              className="w-full flex justify-between items-center px-3 py-3 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              Resources
              <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isResourcesOpen ? 'rotate-180' : ''}`} />
            </button>
            {isResourcesOpen && (
              <div className="pl-6 space-y-1 mt-1">
                <Link to="/docs" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">Documentation</Link>
                <Link to="/api-reference" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">API Reference</Link>
                <Link to="/community" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">Community Guide</Link>
              </div>
            )}
          </div>
          
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
            Contact
          </Link>

          <Link to="/candidate/track" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-3 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
            Candidate Portal
          </Link>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-3 bg-gray-50 dark:bg-gray-800/50">
          <Link to="/signin" className="w-full flex justify-center items-center text-gray-900 bg-white hover:bg-gray-100 dark:text-white dark:bg-gray-700 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 px-4 py-3 rounded-xl text-base font-medium transition-colors shadow-sm">
            Sign In
          </Link>
          <Link to="/register" className="w-full flex justify-center items-center bg-brand-500 hover:bg-brand-600 text-white px-5 py-3 rounded-xl text-base font-medium transition-colors shadow-sm shadow-brand-500/20">
            Register Agency
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="grow pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <Server className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Deploy<span className="text-brand-500">X</span></span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6 leading-relaxed">
              The leading Multi-Tenant SaaS Operating System for Overseas Recruitment Agencies. Empowering manpower companies with digital tools.
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              &copy; {new Date().getFullYear()} DeployX Technologies. All rights reserved.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/features" className="hover:text-brand-500 transition-colors">Features</Link></li>
              <li><Link to="/how-it-works" className="hover:text-brand-500 transition-colors">How it Works</Link></li>
              <li><Link to="/pricing" className="hover:text-brand-500 transition-colors">Pricing</Link></li>
              <li><Link to="/candidate/track" className="hover:text-brand-500 transition-colors">Candidate Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Legal & Support</h4>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/privacy" className="hover:text-brand-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand-500 transition-colors">Terms of Service</Link></li>
              <li><Link to="/contact" className="hover:text-brand-500 transition-colors">Contact Us</Link></li>
              <li><Link to="/signin" className="hover:text-brand-500 transition-colors">System Login</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
