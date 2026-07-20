import { Link } from "react-router";
import { CheckCircle } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="py-24 bg-gray-50 dark:bg-gray-900/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">Transparent SaaS Pricing</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Choose a subscription plan that fits the size of your local government.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Basic Plan */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col mt-4 md:mt-0">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Basic</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">For Rural Municipalities (Gaupalikas)</p>
            <div className="mb-6"><span className="text-4xl font-extrabold text-gray-900 dark:text-white">रु 50,000</span><span className="text-gray-500">/year</span></div>
            <ul className="mb-8 space-y-4 flex-1">
              <li className="flex items-center text-gray-600 dark:text-gray-400"><CheckCircle className="w-5 h-5 text-green-500 mr-3"/> Up to 9 Wards</li>
              <li className="flex items-center text-gray-600 dark:text-gray-400"><CheckCircle className="w-5 h-5 text-green-500 mr-3"/> Basic Tax Engine</li>
              <li className="flex items-center text-gray-600 dark:text-gray-400"><CheckCircle className="w-5 h-5 text-green-500 mr-3"/> Ghatana Darta Module</li>
              <li className="flex items-center text-gray-600 dark:text-gray-400"><CheckCircle className="w-5 h-5 text-green-500 mr-3"/> Standard Support</li>
            </ul>
            <Link to="/register" className="w-full inline-flex items-center justify-center px-6 py-3 border border-brand-500 text-brand-600 dark:text-brand-400 font-medium rounded-full hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">Select Basic</Link>
          </div>
          
          {/* Premium Plan */}
          <div className="bg-brand-500 p-8 rounded-3xl border border-brand-500 shadow-xl shadow-brand-500/20 flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</div>
            <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
            <p className="text-brand-100 mb-6">For Urban Municipalities & Metros</p>
            <div className="mb-6"><span className="text-4xl font-extrabold text-white">रु 1,50,000</span><span className="text-brand-200">/year</span></div>
            <ul className="mb-8 space-y-4 flex-1 text-brand-50">
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-white mr-3"/> Unlimited Wards</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-white mr-3"/> Advanced Custom Tax Rules</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-white mr-3"/> Sifaris & Approvals Workflow</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-white mr-3"/> eSewa Payment Integration</li>
              <li className="flex items-center"><CheckCircle className="w-5 h-5 text-white mr-3"/> 24/7 Priority Support</li>
            </ul>
            <Link to="/register" className="w-full inline-flex items-center justify-center px-6 py-3 bg-white text-brand-600 font-bold rounded-full hover:bg-gray-50 transition-colors">Select Premium</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
