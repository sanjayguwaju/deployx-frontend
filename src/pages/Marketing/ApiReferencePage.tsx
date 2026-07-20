import { useState } from "react";
import { Terminal, Key, Server, Copy, Check } from "lucide-react";

export default function ApiReferencePage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-24">
      {/* Hero Section */}
      <div className="bg-brand-50 dark:bg-brand-900/10 pt-24 pb-16 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl mb-6">
              API Reference
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Integrate your external systems with PalikaOS using our secure REST API. Build custom workflows, sync data, and automate municipal operations.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Main Content (Left) */}
          <div className="lg:col-span-7 space-y-20">
            
            {/* Section: Base URL */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Server className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Base URL</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 leading-relaxed">
                All API requests should be prefixed with the following base URL. The API is served over HTTPS to ensure data privacy and security.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 sm:p-5 border border-gray-200 dark:border-gray-700 flex items-center justify-between group">
                <code className="text-brand-600 dark:text-brand-400 font-mono text-sm sm:text-base font-semibold">
                  https://api.palikaos.com/v1
                </code>
                <button 
                  onClick={() => handleCopy("https://api.palikaos.com/v1")}
                  className="p-2.5 text-gray-400 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-300 transition-all active:scale-95"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
                </button>
              </div>
            </section>

            {/* Section: Authentication */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl">
                  <Key className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Authentication</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
                Authenticate your API requests by including your secret API key in the <code className="bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-md text-sm font-semibold text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">Authorization</code> HTTP header as a Bearer token.
              </p>
              <div className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 p-6 sm:p-8 rounded-r-2xl">
                <h3 className="text-amber-800 dark:text-amber-400 font-bold text-lg mb-2">Keep your keys safe</h3>
                <p className="text-amber-700 dark:text-amber-500/90 leading-relaxed">
                  Your API keys carry full administrative privileges. Never share them in publicly accessible areas such as GitHub, client-side code, or support forums.
                </p>
              </div>
            </section>

            {/* Section: Endpoints (Example) */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Users Endpoint</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
                The Users API allows you to programmatically manage staff accounts within your municipality.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-5 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow bg-white dark:bg-gray-900">
                  <span className="px-3 py-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-mono text-sm font-bold rounded-lg shadow-sm">GET</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">List all users</h3>
                    <code className="text-sm font-semibold text-gray-500 dark:text-gray-400">/v1/users</code>
                  </div>
                </div>
                <div className="flex items-start gap-5 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow bg-white dark:bg-gray-900">
                  <span className="px-3 py-1.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-mono text-sm font-bold rounded-lg shadow-sm">POST</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Create a user</h3>
                    <code className="text-sm font-semibold text-gray-500 dark:text-gray-400">/v1/users</code>
                  </div>
                </div>
                <div className="flex items-start gap-5 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow bg-white dark:bg-gray-900">
                  <span className="px-3 py-1.5 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-mono text-sm font-bold rounded-lg shadow-sm">PATCH</span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Update a user</h3>
                    <code className="text-sm font-semibold text-gray-500 dark:text-gray-400">/v1/users/:id</code>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* Code Snippets (Right - Sticky) */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="sticky top-28 space-y-8">
              
              {/* Request Snippet */}
              <div className="rounded-2xl overflow-hidden bg-[#0d1117] shadow-2xl border border-gray-800">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-[#161b22]">
                  <div className="flex items-center gap-2.5">
                    <Terminal className="h-4 w-4 text-gray-400" />
                    <span className="text-xs font-semibold tracking-wide text-gray-400 font-mono uppercase">cURL Request</span>
                  </div>
                </div>
                <div className="p-5 overflow-x-auto custom-scrollbar">
                  <pre className="text-[13px] font-mono leading-loose text-gray-300">
<span className="text-pink-400 font-semibold">curl</span> https://api.palikaos.com/v1/users \
  <span className="text-blue-400">-H</span> <span className="text-green-300">"Authorization: Bearer YOUR_API_KEY"</span> \
  <span className="text-blue-400">-H</span> <span className="text-green-300">"Content-Type: application/json"</span>
                  </pre>
                </div>
              </div>

              {/* Response Snippet */}
              <div className="rounded-2xl overflow-hidden bg-[#0d1117] shadow-2xl border border-gray-800">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-800 bg-[#161b22]">
                  <div className="flex items-center gap-2.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.7)] animate-pulse"></div>
                    <span className="text-xs font-semibold tracking-wide text-gray-400 font-mono uppercase">JSON Response</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-green-500/10 text-green-400 rounded-md">200 OK</span>
                </div>
                <div className="p-5 overflow-x-auto custom-scrollbar">
                  <pre className="text-[13px] font-mono leading-loose text-gray-300">
&#123;
  <span className="text-blue-300">"success"</span>: <span className="text-orange-300 font-semibold">true</span>,
  <span className="text-blue-300">"data"</span>: [
    &#123;
      <span className="text-blue-300">"id"</span>: <span className="text-green-300">"usr_1a2b3c"</span>,
      <span className="text-blue-300">"name"</span>: <span className="text-green-300">"Musharof Chowdhury"</span>,
      <span className="text-blue-300">"email"</span>: <span className="text-green-300">"admin@palikaos.com"</span>,
      <span className="text-blue-300">"roles"</span>: [<span className="text-green-300">"SUPER_ADMIN"</span>]
    &#125;,
    <span className="text-gray-500 italic">...</span>
  ]
&#125;
                  </pre>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
