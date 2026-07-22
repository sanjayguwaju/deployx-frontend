import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-boxdark-2 py-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
        
        <div className="prose prose-brand dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
          <p className="mb-6">Last updated: July 22, 2026</p>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">1. Data Controller</h2>
          <p className="mb-6">
            When you use DeployX, you (the Recruitment Agency) act as the Data Controller for all candidate data. DeployX acts strictly as the Data Processor, providing the CRM infrastructure to store and manage this data.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">2. Information We Collect</h2>
          <p className="mb-6">
            We collect information you provide directly to us when you register for an agency account. We also process the candidate data you upload into the system, including names, passport numbers, and medical reports, strictly on your behalf.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">3. Use of AI and OCR</h2>
          <p className="mb-6">
            DeployX utilizes AI Vision models to extract data from uploaded passports and visas (OCR). These documents are processed securely and are not used to train global AI models without explicit consent.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">4. Security</h2>
          <p className="mb-6">
            We implement industry-standard security measures to protect your agency's data and your candidates' sensitive documents against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
