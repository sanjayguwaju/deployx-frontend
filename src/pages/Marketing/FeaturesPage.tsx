import React from 'react';

const FeaturesPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-boxdark-2 py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
            Everything you need to run a modern manpower agency
          </h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
            DeployX replaces your scattered spreadsheets, WhatsApp chats, and paper files with a single, intelligent CRM.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-50 dark:bg-boxdark rounded-2xl p-8 border border-gray-100 dark:border-strokedark">
            <div className="text-brand-600 dark:text-brand-400 mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002 2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Kanban Pipeline</h3>
            <p className="text-gray-600 dark:text-gray-400">Drag and drop candidates across stages like Medical, Visa, and Ticket. Instantly see your deployment bottlenecks.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-50 dark:bg-boxdark rounded-2xl p-8 border border-gray-100 dark:border-strokedark">
            <div className="text-brand-600 dark:text-brand-400 mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Smart OCR Parsing</h3>
            <p className="text-gray-600 dark:text-gray-400">Stop typing passport numbers. Upload a scan and our AI Vision model extracts the data with 99% accuracy.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-50 dark:bg-boxdark rounded-2xl p-8 border border-gray-100 dark:border-strokedark">
            <div className="text-brand-600 dark:text-brand-400 mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Native e-Signatures</h3>
            <p className="text-gray-600 dark:text-gray-400">Generate employment contracts and send them via a public link for mobile-friendly digital signatures.</p>
          </div>

          {/* Feature 4 */}
          <div className="bg-gray-50 dark:bg-boxdark rounded-2xl p-8 border border-gray-100 dark:border-strokedark">
            <div className="text-brand-600 dark:text-brand-400 mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">WhatsApp Automation</h3>
            <p className="text-gray-600 dark:text-gray-400">Automated WhatsApp notifications to candidates when their visa is approved or their flight is booked.</p>
          </div>

          {/* Feature 5 */}
          <div className="bg-gray-50 dark:bg-boxdark rounded-2xl p-8 border border-gray-100 dark:border-strokedark">
            <div className="text-brand-600 dark:text-brand-400 mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sub-Agent Portals</h3>
            <p className="text-gray-600 dark:text-gray-400">Provide brokers their own login to submit candidates and view their commission ledger in real-time.</p>
          </div>
          
          {/* Feature 6 */}
          <div className="bg-gray-50 dark:bg-boxdark rounded-2xl p-8 border border-gray-100 dark:border-strokedark">
            <div className="text-brand-600 dark:text-brand-400 mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Automated PDFs</h3>
            <p className="text-gray-600 dark:text-gray-400">Generate beautiful PDF invoices, flight tickets, and reports on the fly directly from the backend.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
