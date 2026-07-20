import { Link } from "react-router";
import { ArrowRight, FileX, FolderSearch, Clock, Building } from "lucide-react";

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative pt-12 pb-20 sm:pt-24 sm:pb-24 overflow-hidden bg-white dark:bg-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-50 via-white to-white dark:from-brand-900/20 dark:via-gray-900 dark:to-gray-900" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 px-4 py-2 rounded-full text-sm font-medium mb-8 border border-brand-200 dark:border-brand-500/20">
            <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse"></span>
            <span>Version 2.0 is now live</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8">
            The Operating System for <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-blue-600">
              Nepal's Local Governments
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
            A comprehensive, multi-tenant SaaS platform empowering municipalities with digital archiving, dynamic tax engines, vital events registration, and citizen tracking.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/register" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-full transition-all shadow-lg shadow-brand-500/30 hover:-translate-y-0.5">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/features" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 dark:text-white dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700/50 rounded-full transition-all">
              Explore Features
            </Link>
          </div>
        </div>
      </div>

      {/* The Problem We Solve Section */}
      <div className="py-24 bg-gray-50 dark:bg-gray-800/50 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">The Challenge of Local Governance</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Municipalities are burdened by legacy systems, making citizen service delivery slow and inefficient. Here is what PalikaOS solves:</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex space-x-6">
              <div className="shrink-0">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center">
                  <FileX className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Manual Paperwork Overload</h3>
                <p className="text-gray-600 dark:text-gray-400">Handling thousands of physical documents for Sifaris (Recommendations) and Ghatana Darta leads to lost files and hours of manual verification. PalikaOS digitizes and automates these processes with e-signatures.</p>
              </div>
            </div>

            <div className="flex space-x-6">
              <div className="shrink-0">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center">
                  <FolderSearch className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Scattered Citizen Data</h3>
                <p className="text-gray-600 dark:text-gray-400">Citizens often have to re-submit basic information to different wards. Our unified database ensures a single source of truth across all departments in the municipality.</p>
              </div>
            </div>

            <div className="flex space-x-6">
              <div className="shrink-0">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Slow Tax Processing</h3>
                <p className="text-gray-600 dark:text-gray-400">Calculating complex property and business taxes manually is error-prone. Our dynamic Tax Engine computes fees instantly based on JSON rules you define.</p>
              </div>
            </div>

            <div className="flex space-x-6">
              <div className="shrink-0">
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center">
                  <Building className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">High IT Infrastructure Costs</h3>
                <p className="text-gray-600 dark:text-gray-400">Maintaining local servers and custom software for every rural municipality is unsustainable. PalikaOS's multi-tenant SaaS model gives every local government enterprise-grade software at a fraction of the cost.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-brand-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-6">Ready to digitize your municipality?</h2>
          <p className="text-lg text-brand-100 mb-10">Join the growing network of smart local governments in Nepal. Deploy your dedicated SaaS environment in minutes.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 text-base font-bold text-brand-900 bg-white hover:bg-gray-50 rounded-full transition-colors">
              Start your free trial
            </Link>
            <Link to="/contact" className="w-full sm:w-auto px-8 py-4 text-base font-medium text-white border border-brand-700 hover:bg-brand-800 rounded-full transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
