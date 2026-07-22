import React from 'react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-boxdark-2 py-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Terms of Service</h1>
        
        <div className="prose prose-brand dark:prose-invert max-w-none text-gray-600 dark:text-gray-400">
          <p className="mb-6">Last updated: July 22, 2026</p>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-6">
            By accessing and using DeployX ("the Platform"), an overseas manpower recruitment CRM, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">2. B2B Software as a Service</h2>
          <p className="mb-6">
            DeployX provides Software as a Service (SaaS) for recruitment agencies to manage candidates, employers, pipelines, and compliance. We are a software provider and do not participate in the recruitment process itself.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">3. Data Responsibility</h2>
          <p className="mb-6">
            You, the agency, are entirely responsible for the data you input into the CRM, including the personal data of your candidates. You must ensure you have the appropriate legal basis and consent from candidates to process their data in DeployX.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">4. Compliance and Visas</h2>
          <p className="mb-6">
            DeployX does not guarantee visa approvals, medical clearances, or successful deployments. The platform is merely a tool to track your operational status. 
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">5. Termination</h2>
          <p className="mb-6">
            We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms, including using the software for fraudulent recruitment practices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
