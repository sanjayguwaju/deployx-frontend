import { ArrowLeft, ThumbsUp, ThumbsDown, Clock, Calendar } from "lucide-react";
import { Link, useParams } from "react-router";

export default function DocumentationArticlePage() {
  const { slug } = useParams();
  
  // Simple title generator from slug, falling back to a default title if not provided
  const title = slug 
    ? slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') 
    : "Understanding Role-Based Access Control (RBAC)";
  
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-brand-50 dark:bg-brand-900/10 pt-24 pb-12 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/docs" className="inline-flex items-center text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-medium mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documentation
          </Link>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> Updated 2 days ago</span>
            <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" /> 5 min read</span>
            <span className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">User Management</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl leading-tight">
            {title}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <article className="prose prose-lg dark:prose-invert prose-brand max-w-none">
          <p className="lead">
            Role-Based Access Control (RBAC) is a method of restricting network access based on the roles of individual users within an enterprise. In DeployX, RBAC ensures that municipal staff only have access to the information and actions necessary for their specific jobs.
          </p>

          <h2>Core Concepts</h2>
          <p>
            DeployX utilizes three main components for its permission system:
          </p>
          <ul>
            <li><strong>Users:</strong> The actual individuals logging into the system.</li>
            <li><strong>Roles:</strong> A collection of permissions (e.g., "Ward Secretary", "Mayor", "IT Admin").</li>
            <li><strong>Permissions:</strong> Specific rights to perform actions on resources (e.g., "approve_document", "create_user").</li>
          </ul>

          <h2>Default Roles</h2>
          <p>
            When you register your agency on DeployX, several default roles are automatically provisioned:
          </p>
          
          <div className="overflow-x-auto my-8">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Key Permissions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Super Admin</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Full access to the entire agency portal.</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">All permissions</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Ward Secretary</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Manages operations at the ward level.</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Manage ward citizens, approve local documents</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Tax Officer</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Handles revenue and taxation.</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">View tax records, process payments</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>How to Assign Roles to Users</h2>
          <p>
            To assign a role to a user, you must have the <code>manage_users</code> permission. Follow these steps:
          </p>
          <ol>
            <li>Navigate to the <strong>User Management</strong> section from your dashboard sidebar.</li>
            <li>Find the user you wish to modify in the table.</li>
            <li>Click the <strong>Edit</strong> (pencil) icon next to their name.</li>
            <li>In the edit modal, locate the <strong>Roles</strong> dropdown field.</li>
            <li>Select the appropriate role(s) for the user.</li>
            <li>Click <strong>Save Changes</strong>.</li>
          </ol>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 my-8 rounded-r-lg">
            <div className="flex">
              <div className="shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Note:</strong> Changes to a user's roles will take effect the next time they log in or refresh their application session.
                </p>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 dark:text-gray-400 font-medium">Was this article helpful?</p>
          <div className="flex gap-3">
            <button className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <ThumbsUp className="w-4 h-4 mr-2 text-green-500" /> Yes
            </button>
            <button className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <ThumbsDown className="w-4 h-4 mr-2 text-red-500" /> No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
