import { Users, FileCheck, Brain, Globe, Shield, BarChart2 } from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      color: "blue",
      title: "Candidate CRM",
      description: "A full 360° profile for every worker — skills, documents, employment history, medical status, and pipeline stage — all searchable and filterable in real time.",
    },
    {
      icon: <Globe className="w-6 h-6" />,
      color: "green",
      title: "Employer & Demand Management",
      description: "Manage foreign employer accounts, job demands, quotas, and required qualifications. Match candidates to open demands instantly with AI-powered scoring.",
    },
    {
      icon: <FileCheck className="w-6 h-6" />,
      color: "purple",
      title: "Automated Deployment Pipeline",
      description: "Move candidates through Medical → Visa → Ticket → Deployment with automated gate checks, compliance validation, and real-time status tracking.",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      color: "red",
      title: "Contracts & Compliance",
      description: "Generate, e-sign, and store employment contracts. Track license renewals, compliance checks, and government-mandated documents with expiry alerts.",
    },
    {
      icon: <BarChart2 className="w-6 h-6" />,
      color: "yellow",
      title: "Finance & Commission Engine",
      description: "Issue invoices to employers, track service charges and expenses, calculate agent commissions automatically, and export financial reports for auditing.",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      color: "teal",
      title: "AI Matching & OCR",
      description: "Automatically extract data from passports and visas using AI OCR. Match candidates to demands by skill similarity score. Ask your data in plain English using the AI Assistant.",
    },
  ];

  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
    teal: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
  };

  return (
    <div className="py-24 bg-gray-50 dark:bg-gray-900/50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">Everything your agency needs</h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Replace dozens of disconnected tools — spreadsheets, WhatsApp groups, and paper files — with one unified recruitment operating system.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xs hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 ${colorMap[f.color]} rounded-xl flex items-center justify-center mb-6`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
