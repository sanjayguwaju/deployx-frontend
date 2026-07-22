import React from 'react';

const HowItWorksPage: React.FC = () => {
  return (
    <div className="bg-white dark:bg-boxdark-2 py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight sm:text-5xl">
            How DeployX Works
          </h1>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
            Streamline your overseas recruitment agency in three simple steps.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-brand-100 dark:bg-strokedark -translate-y-1/2 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {/* Step 1 */}
            <div className="bg-white dark:bg-boxdark p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-strokedark text-center transform transition hover:-translate-y-2">
              <div className="w-16 h-16 bg-brand-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-md border-4 border-white dark:border-boxdark">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Set up your Agency</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Register your agency, add your HR team members, and connect your WhatsApp Business API to enable automated notifications.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white dark:bg-boxdark p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-strokedark text-center transform transition hover:-translate-y-2">
              <div className="w-16 h-16 bg-brand-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-md border-4 border-white dark:border-boxdark">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Manage Job Demands</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Enter requirements from foreign employers (e.g., Qatar Airways requires 50 Chefs). Invite sub-agents to submit candidates directly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white dark:bg-boxdark p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-strokedark text-center transform transition hover:-translate-y-2">
              <div className="w-16 h-16 bg-brand-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-md border-4 border-white dark:border-boxdark">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Deploy & Track</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Drag candidates through the Medical, Visa, and Ticket stages on your Kanban board. Generate contracts and pay out commissions easily.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
