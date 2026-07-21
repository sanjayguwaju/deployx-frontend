import { Search, BookOpen, Users, Palette, Globe, CheckCircle, Code, ChevronRight, FileText } from "lucide-react";
import { Link } from "react-router";

const categories = [
  {
    title: "Getting Started",
    description: "Learn the basics of DeployX and set up your municipality profile.",
    icon: BookOpen,
    color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  },
  {
    title: "User Management",
    description: "Manage roles, permissions, and staff accounts securely.",
    icon: Users,
    color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  },
  {
    title: "Tenant Branding",
    description: "Customize logos, colors, and the overall look of your portal.",
    icon: Palette,
    color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  },
  {
    title: "Citizen Portal",
    description: "Configure how citizens interact with municipal services.",
    icon: Globe,
    color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
  },
  {
    title: "Approval Workflows",
    description: "Set up hierarchical approval chains for documents and requests.",
    icon: CheckCircle,
    color: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400",
  },
  {
    title: "Developer API",
    description: "Integrate DeployX with third-party tools using our REST API.",
    icon: Code,
    color: "bg-slate-50 text-slate-600 dark:bg-slate-900/20 dark:text-slate-400",
  },
];

const popularArticles = [
  "How to change the primary brand color",
  "Inviting a new staff member",
  "Setting up citizen registration",
  "Understanding role-based access control (RBAC)",
  "Configuring multi-level document approvals"
];

export default function DocumentationPage() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-24">
      {/* Hero Section */}
      <div className="bg-brand-50 dark:bg-brand-900/10 pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl mb-6">
            How can we help you?
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Search our knowledge base or browse categories to learn how to configure and use DeployX effectively.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search for articles, guides, or features..."
              className="block w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 shadow-sm focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 sm:text-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:focus:ring-brand-400/20 dark:focus:border-brand-400 transition-all outline-none"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        {/* Categories Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/docs/${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 hover:border-brand-500/30 dark:hover:border-brand-400/30"
              >
                <div className={`inline-flex p-3 rounded-xl mb-5 ${category.color}`}>
                  <category.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {category.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">
                  {category.description}
                </p>
                <div className="flex items-center text-brand-600 dark:text-brand-400 text-sm font-semibold mt-auto absolute bottom-6">
                  View articles
                  <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Articles & Support */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Popular Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {popularArticles.map((article, index) => (
                <Link
                  key={index}
                  to={`/docs/${article.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex items-start group p-4 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-all"
                >
                  <div className="mt-0.5 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg group-hover:bg-brand-50 dark:group-hover:bg-brand-900/20 mr-4 transition-colors">
                    <FileText className="h-5 w-5 text-gray-500 group-hover:text-brand-600 dark:group-hover:text-brand-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug">
                    {article}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-brand-600 dark:bg-brand-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col justify-center">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full bg-white opacity-10 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-black opacity-10 blur-xl"></div>
            <div className="absolute top-1/2 right-10 w-20 h-20 rounded-full border-4 border-white opacity-10"></div>
            
            <h2 className="text-3xl font-bold mb-4 relative z-10">Need more help?</h2>
            <p className="text-brand-100 mb-8 relative z-10 text-lg">
              Can't find what you're looking for? Our dedicated support team is here to assist you.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-base font-bold rounded-xl text-brand-700 bg-white hover:bg-gray-50 hover:scale-105 active:scale-95 transition-all relative z-10 w-fit shadow-md"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
