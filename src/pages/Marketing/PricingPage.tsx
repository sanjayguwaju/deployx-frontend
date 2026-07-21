import { Link } from "react-router";
import { CheckCircle } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="py-24 bg-gray-50 dark:bg-gray-900/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">Transparent SaaS Pricing</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Choose a plan that fits the size of your recruitment agency. No hidden fees.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter Plan */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Starter</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">For small agencies just getting started</p>
            <div className="mb-6"><span className="text-4xl font-extrabold text-gray-900 dark:text-white">$49</span><span className="text-gray-500">/month</span></div>
            <ul className="mb-8 space-y-4 flex-1">
              <li className="flex items-center text-gray-600 dark:text-gray-400"><CheckCircle className="w-5 h-5 text-green-500 mr-3"/>Up to 200 Candidates</li>
              <li className="flex items-center text-gray-600 dark:text-gray-400"><CheckCircle className="w-5 h-5 text-green-500 mr-3"/>5 Staff Accounts</li>
              <li className="flex items-center text-gray-600 dark:text-gray-400"><CheckCircle className="w-5 h-5 text-green-500 mr-3"/>Pipeline & Document Management</li>
              <li className="flex items-center text-gray-600 dark:text-gray-400"><CheckCircle className="w-5 h-5 text-green-500 mr-3"/>Employer & Demand Module</li>
              <li className="flex items-center text-gray-600 dark:text-gray-400"><CheckCircle className="w-5 h-5 text-green-500 mr-3"/>Standard Support</li>
            </ul>
            <Link to="/register" className="w-full inline-flex items-center justify-center px-6 py-3 border border-brand-500 text-brand-600 dark:text-brand-400 font-medium rounded-full hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">Get Started</Link>
          </div>

          {/* Professional Plan */}
          <div className="bg-brand-500 p-8 rounded-3xl border border-brand-500 shadow-xl shadow-brand-500/20 flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</div>
            <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
            <p className="text-brand-100 mb-6">For growing agencies with high volume</p>
            <div className="mb-6"><span className="text-4xl font-extrabold text-white">$149</span><span className="text-brand-200">/month</span></div>
            <ul className="mb-8 space-y-4 flex-1 text-brand-50">
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-white mr-3"/>Up to 2,000 Candidates</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-white mr-3"/>Unlimited Staff Accounts</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-white mr-3"/>AI Candidate Matching & OCR</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-white mr-3"/>Finance, Invoices & Commissions</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-white mr-3"/>Agent & Employer Portals</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-white mr-3"/>24/7 Priority Support</li>
            </ul>
            <Link to="/register" className="w-full inline-flex items-center justify-center px-6 py-3 bg-white text-brand-600 font-bold rounded-full hover:bg-gray-50 transition-colors">Select Professional</Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Enterprise</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">For large agencies & multi-branch networks</p>
            <div className="mb-6"><span className="text-4xl font-extrabold text-gray-900 dark:text-white">Custom</span></div>
            <ul className="mb-8 space-y-4 flex-1">
              <li className="flex items-center text-gray-600 dark:text-gray-400"><CheckCircle className="w-5 h-5 text-green-500 mr-3"/>Unlimited Candidates</li>
              <li className="flex items-center text-gray-600 dark:text-gray-400"><CheckCircle className="w-5 h-5 text-green-500 mr-3"/>White-label Branding</li>
              <li className="flex items-center text-gray-600 dark:text-gray-400"><CheckCircle className="w-5 h-5 text-green-500 mr-3"/>Custom API Integrations</li>
              <li className="flex items-center text-gray-600 dark:text-gray-400"><CheckCircle className="w-5 h-5 text-green-500 mr-3"/>Dedicated Account Manager</li>
              <li className="flex items-center text-gray-600 dark:text-gray-400"><CheckCircle className="w-5 h-5 text-green-500 mr-3"/>SLA & On-premise options</li>
            </ul>
            <Link to="/contact" className="w-full inline-flex items-center justify-center px-6 py-3 border border-brand-500 text-brand-600 dark:text-brand-400 font-medium rounded-full hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">Contact Sales</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
