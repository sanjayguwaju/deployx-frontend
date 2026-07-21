import { MessageSquare, Users, BookOpen, HeartHandshake, ChevronRight, MessageCircle, Code } from "lucide-react";

const communityLinks = [
  {
    title: "Community Forums",
    description: "Ask questions, share solutions, and discuss best practices with other DeployX administrators.",
    icon: MessageSquare,
    action: "Visit Forums",
    color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
  },
  {
    title: "Slack Workspace",
    description: "Join our active Slack community for real-time chat, networking, and quick support.",
    icon: MessageCircle,
    action: "Join Slack",
    color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  },
  {
    title: "GitHub Discussions",
    description: "Contribute to DeployX, suggest features, and track the development roadmap.",
    icon: Code,
    action: "View GitHub",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  },
  {
    title: "User Groups & Meetups",
    description: "Find or host local government tech meetups in your province or district.",
    icon: Users,
    action: "Find Events",
    color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
  },
];

export default function CommunityPage() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-24">
      {/* Hero Section */}
      <div className="bg-brand-50 dark:bg-brand-900/10 pt-24 pb-16 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 mb-6">
            <HeartHandshake className="h-8 w-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl mb-6">
            Join the DeployX Community
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Connect with other municipalities, share best practices, and help shape the future of local government technology in Nepal.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        
        {/* Connection Channels Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">Ways to Connect</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {communityLinks.map((link, index) => (
              <div 
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 dark:hover:border-brand-400/30 flex flex-col"
              >
                <div className={`inline-flex p-3.5 rounded-2xl mb-6 w-fit ${link.color}`}>
                  <link.icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {link.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8 grow">
                  {link.description}
                </p>
                <a 
                  href="#" 
                  className="inline-flex items-center text-brand-600 dark:text-brand-400 font-bold group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors mt-auto text-lg"
                >
                  {link.action}
                  <ChevronRight className="h-5 w-5 ml-1.5 transform group-hover:translate-x-1.5 transition-transform" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="max-w-5xl mx-auto bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-8 sm:p-12 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="shrink-0 p-5 bg-brand-100 dark:bg-brand-900/30 rounded-2xl text-brand-600 dark:text-brand-400">
              <BookOpen className="h-12 w-12" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Community Guidelines</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                We are committed to providing a friendly, safe, and welcoming environment for everyone, regardless of technical experience or background. By participating in our community, you agree to adhere to our code of conduct.
              </p>
              <ul className="space-y-5 mb-10">
                <li className="flex items-start">
                  <div className="h-7 w-7 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center font-bold text-sm mr-4 mt-0.5 shrink-0">✓</div>
                  <span className="text-gray-700 dark:text-gray-300 text-lg">Be respectful and inclusive to all members.</span>
                </li>
                <li className="flex items-start">
                  <div className="h-7 w-7 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center font-bold text-sm mr-4 mt-0.5 shrink-0">✓</div>
                  <span className="text-gray-700 dark:text-gray-300 text-lg">Share knowledge generously and help others.</span>
                </li>
                <li className="flex items-start">
                  <div className="h-7 w-7 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center font-bold text-sm mr-4 mt-0.5 shrink-0">✓</div>
                  <span className="text-gray-700 dark:text-gray-300 text-lg">Keep discussions constructive and focused on municipality governance and technology.</span>
                </li>
              </ul>
              <a href="#" className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 dark:border-gray-600 shadow-sm text-base font-bold rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Read Full Guidelines
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
