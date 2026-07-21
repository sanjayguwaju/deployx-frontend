export default function HowItWorksPage() {
  return (
    <div className="py-24 bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">Seamless Onboarding Process</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Get your agency's recruitment workspace live in 3 simple steps.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="relative">
            <div className="w-16 h-16 mx-auto bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center text-2xl font-bold mb-6">1</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Register Your Agency</h3>
            <p className="text-gray-600 dark:text-gray-400">Submit your agency details and select a unique <code>.deployx.io</code> subdomain. Takes less than 2 minutes.</p>
          </div>
          <div className="relative">
            <div className="w-16 h-16 mx-auto bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center text-2xl font-bold mb-6">2</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Verification</h3>
            <p className="text-gray-600 dark:text-gray-400">Our team verifies your agency's business credentials and activates your dedicated multi-tenant workspace within 24 hours.</p>
          </div>
          <div className="relative">
            <div className="w-16 h-16 mx-auto bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center text-2xl font-bold mb-6">3</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Go Live</h3>
            <p className="text-gray-600 dark:text-gray-400">Log in, invite your team, import candidates, and start processing job demands and deployment pipelines immediately.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
