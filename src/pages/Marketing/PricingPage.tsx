import React from 'react';
import { Link } from 'react-router';

const PricingPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-boxdark-2 py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
            Simple, Transparent Pricing
          </h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
            Choose the perfect plan for your Manpower Recruitment Agency. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter Plan */}
          <div className="bg-white dark:bg-boxdark rounded-2xl shadow-sm border border-gray-200 dark:border-strokedark p-8 flex flex-col">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Starter Agency</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Perfect for small, emerging recruitment agencies.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">$99</span>
              <span className="text-gray-500 dark:text-gray-400">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Up to 5 HR Team Members
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                1,000 Active Candidates
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Kanban Pipeline Management
              </li>
              <li className="flex items-center text-gray-400 dark:text-gray-600">
                <svg className="w-5 h-5 text-gray-300 dark:text-gray-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                No AI OCR Parsing
              </li>
              <li className="flex items-center text-gray-400 dark:text-gray-600">
                <svg className="w-5 h-5 text-gray-300 dark:text-gray-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                No Agent Portal
              </li>
            </ul>
            <Link to="/register" className="block w-full py-3 px-4 bg-brand-50 dark:bg-meta-4 text-brand-700 dark:text-brand-300 font-medium text-center rounded-lg hover:bg-brand-100 dark:hover:bg-strokedark transition">
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* Growth Plan (Most Popular) */}
          <div className="bg-brand-600 rounded-2xl shadow-xl border border-brand-500 p-8 flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-400 to-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Growth Agency</h3>
            <p className="text-brand-100 mb-6 text-sm">Everything you need to automate deployments.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-white">$249</span>
              <span className="text-brand-200">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center text-white">
                <svg className="w-5 h-5 text-brand-200 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Unlimited HR Team Members
              </li>
              <li className="flex items-center text-white">
                <svg className="w-5 h-5 text-brand-200 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                10,000 Active Candidates
              </li>
              <li className="flex items-center text-white">
                <svg className="w-5 h-5 text-brand-200 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                AI OCR Document Parsing
              </li>
              <li className="flex items-center text-white">
                <svg className="w-5 h-5 text-brand-200 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Sub-Agent Commission Portal
              </li>
              <li className="flex items-center text-white">
                <svg className="w-5 h-5 text-brand-200 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                WhatsApp Automation Integration
              </li>
            </ul>
            <Link to="/register" className="block w-full py-3 px-4 bg-white text-brand-600 font-bold text-center rounded-lg hover:bg-gray-50 shadow-md transition">
              Start 14-Day Free Trial
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white dark:bg-boxdark rounded-2xl shadow-sm border border-gray-200 dark:border-strokedark p-8 flex flex-col">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Enterprise Portfolio</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">For multi-branch international recruitment firms.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">$899</span>
              <span className="text-gray-500 dark:text-gray-400">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Unlimited Everything
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Custom SLA & Support
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Dedicated Account Manager
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Custom White-Label Branding
              </li>
              <li className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                API Access
              </li>
            </ul>
            <Link to="/contact" className="block w-full py-3 px-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-center rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition">
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
