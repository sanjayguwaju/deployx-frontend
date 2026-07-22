import React from 'react';
import { Link } from 'react-router';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-boxdark-2 text-gray-900 dark:text-bodydark">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white dark:from-meta-4 dark:to-boxdark-2 pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-brand-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-brand-100 dark:bg-meta-4 text-brand-600 dark:text-brand-300 text-sm font-semibold mb-6 shadow-sm border border-brand-200 dark:border-strokedark">
            🚀 The New Standard for Manpower Agencies
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Deploy<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-blue-500">X</span>
            <br />
            <span className="text-gray-800 dark:text-white">Smart Recruitment CRM</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
            The ultimate AI-powered CRM designed exclusively for overseas manpower agencies. Automate your pipelines, generate contracts, parse passports with OCR, and seamlessly manage sub-agent commissions all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex justify-center items-center py-4 px-8 border border-transparent text-lg font-medium rounded-full text-white bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Start Free Trial
            </Link>
            <Link
              to="/features"
              className="inline-flex justify-center items-center py-4 px-8 border border-gray-300 dark:border-strokedark text-lg font-medium rounded-full text-gray-700 dark:text-gray-200 bg-white dark:bg-boxdark hover:bg-gray-50 dark:hover:bg-meta-4 transition-all shadow-sm"
            >
              See All Features
            </Link>
          </div>
        </div>
      </section>

      {/* Why DeployX Section */}
      <section className="py-20 bg-white dark:bg-boxdark-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-600 uppercase tracking-wider">The Agency Challenge</h2>
            <h3 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Stop Managing Candidates in Spreadsheets
            </h3>
            <p className="mt-4 max-w-3xl text-xl text-gray-500 mx-auto">
              Recruitment agencies are burdened by scattered Whatsapp messages, lost passport copies, and confusing commission tracking. DeployX solves this.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="relative p-8 bg-gray-50 dark:bg-boxdark rounded-2xl border border-gray-100 dark:border-strokedark hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-blue-100 dark:bg-meta-4 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002 2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Drag & Drop Pipelines</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Visualize every candidate's progress from Medical to Visa to Deployment using our interactive Kanban boards, just like Monday.com.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="relative p-8 bg-gray-50 dark:bg-boxdark rounded-2xl border border-gray-100 dark:border-strokedark hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-brand-100 dark:bg-meta-4 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">AI Document Parsing</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Upload passports and visas and let our AI Vision model automatically extract names, numbers, and dates. Zero manual data entry.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="relative p-8 bg-gray-50 dark:bg-boxdark rounded-2xl border border-gray-100 dark:border-strokedark hover:shadow-xl transition-all transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-green-100 dark:bg-meta-4 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Sub-Agent Portals</h4>
              <p className="text-gray-600 dark:text-gray-400">
                Give your local brokers their own dedicated portal to submit candidates directly and track their pending and paid commissions in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between relative z-10">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to scale your agency?</span>
            <span className="block text-brand-200">Start your 14-day free trial today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 gap-4">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-brand-600 bg-white hover:bg-brand-50 shadow-lg transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
