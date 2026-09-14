import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import api from "../../api/axios";
import { CheckCircle2, XCircle } from "lucide-react";
import PageMeta from "../../components/common/PageMeta";

interface DocumentData {
  documentType: string;
  templateName?: string;
  issueDate?: string;
  issuedBy?: {
    name: string;
    email: string;
  };
  agency?: {
    name: string;
    country?: string;
  };
  status?: string;
}

export default function VerifyDocument() {
  const { hash } = useParams<{ hash: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doc, setDoc] = useState<DocumentData | null>(null);

  useEffect(() => {
    if (!hash) {
      setError("No verification hash provided in URL.");
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await api.get(`/contracts/${hash}/public`);
        if (res.data.success && res.data.data) {
          const data = res.data.data;
          setDoc({
            documentType: "Employment Contract",
            templateName: data.templateName || "Standard Recruitment Contract",
            issueDate: data.createdAt,
            issuedBy: {
              name: data.employer?.companyName || "Authorized Agency Officer",
              email: data.employer?.contactPersons?.[0]?.email || "",
            },
            agency: {
              name: data.tenantId?.name || "Licensed Recruitment Agency",
            },
            status: data.signatureStatus || data.status || "verified",
          });
        } else {
          setError("Failed to verify document signature.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Invalid or unverified document record.");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [hash]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"></div>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">Verifying document authenticity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
      <PageMeta title="Verify Document | DeployX" description="Verify authentic manpower recruitment contracts and documents." />
      <div className="w-full max-w-md space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-gray-800">
        <div className="text-center">
          {error ? (
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500">
              <XCircle className="w-7 h-7" />
            </div>
          ) : (
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500">
              <CheckCircle2 className="w-7 h-7" />
            </div>
          )}
          <h2 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
            {error ? "Verification Failed" : "Authentic Verified Document"}
          </h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {error ? error : "This document record matches official licensed recruitment agency logs."}
          </p>
        </div>

        {doc && (
          <div className="border-t border-gray-100 pt-4 dark:border-gray-700">
            <dl className="divide-y divide-gray-100 dark:divide-gray-700 text-xs">
              <div className="flex justify-between py-2">
                <dt className="text-gray-500 dark:text-gray-400">Agency / Employer</dt>
                <dd className="font-medium text-gray-900 dark:text-white text-right">
                  {doc.agency?.name || "Licensed Agency"}
                </dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-gray-500 dark:text-gray-400">Document Type</dt>
                <dd className="text-gray-900 dark:text-white uppercase font-mono">
                  {doc.documentType}
                </dd>
              </div>
              {doc.issueDate && (
                <div className="flex justify-between py-2">
                  <dt className="text-gray-500 dark:text-gray-400">Issued On</dt>
                  <dd className="text-gray-900 dark:text-white">
                    {new Date(doc.issueDate).toLocaleDateString()}
                  </dd>
                </div>
              )}
              {doc.issuedBy?.name && (
                <div className="flex justify-between py-2">
                  <dt className="text-gray-500 dark:text-gray-400">Issued By</dt>
                  <dd className="text-gray-900 dark:text-white">
                    {doc.issuedBy.name}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}

        <div className="pt-2 text-center">
          <Link to="/" className="text-xs font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400">
            Return to Homepage &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
