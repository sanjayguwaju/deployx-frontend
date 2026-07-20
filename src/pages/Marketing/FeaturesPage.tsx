import { Database, FileText, Shield } from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="py-24 bg-gray-50 dark:bg-gray-900/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">Everything your municipality needs</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Replace dozens of outdated tools with one unified operating system.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Multi-Tenant Architecture</h3>
            <p className="text-gray-600 dark:text-gray-400">Strict data isolation between municipalities via dedicated subdomains and partitioned S3 storage.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center mb-6">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Dynamic Tax Engine</h3>
            <p className="text-gray-600 dark:text-gray-400">Create custom JSON-based tax rules for properties and businesses. Automatically calculate fees instantly.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Ghatana Darta & Sifaris</h3>
            <p className="text-gray-600 dark:text-gray-400">Automated vital events registration with localized B.S. dates and dynamic Puppeteer-generated PDFs.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
