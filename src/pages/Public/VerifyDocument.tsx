import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import api from "../../api/axios";
import { CheckCircleIcon, CloseIcon } from "../../icons";
import PageMeta from "../../components/common/PageMeta";

interface DocumentData {
  documentType: string;
  templateName: string;
  issueDate: string;
  issuedBy: {
    _id: string;
    name: string;
    email: string;
  };
  municipality: {
    _id: string;
    name: string;
    nameNp?: string;
  };
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
        const res = await api.get(`/sifaris/verify/${hash}`);
        if (res.data.success) {
          setDoc(res.data.data);
        } else {
          setError("Failed to verify document.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Invalid or forged document.");
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
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Verifying document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 dark:bg-gray-900">
      <PageMeta title="Verify Document | PalikaOS" description="Verify official government documents." />
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">
        <div className="text-center">
          {error ? (
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500">
              <CloseIcon />
            </div>
          ) : (
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500">
              <CheckCircleIcon />
            </div>
          )}
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            {error ? "Verification Failed" : "Verified Official Document"}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {error ? error : "This document matches official municipality records and is authentic."}
          </p>
        </div>

        {doc && (
          <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
            <dl className="divide-y divide-gray-200 dark:divide-gray-700">
              <div className="flex justify-between py-3">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Municipality</dt>
                <dd className="text-sm font-bold text-gray-900 dark:text-white text-right">
                  {doc.municipality.nameNp || doc.municipality.name}
                </dd>
              </div>
              <div className="flex justify-between py-3">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Document Type</dt>
                <dd className="text-sm text-gray-900 dark:text-white uppercase">
                  {doc.documentType} ({doc.templateName})
                </dd>
              </div>
              <div className="flex justify-between py-3">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Issued On</dt>
                <dd className="text-sm text-gray-900 dark:text-white">
                  {new Date(doc.issueDate).toLocaleDateString()}
                </dd>
              </div>
              <div className="flex justify-between py-3">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Issued By</dt>
                <dd className="text-sm text-gray-900 dark:text-white">
                  {doc.issuedBy.name}
                </dd>
              </div>
            </dl>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm font-medium text-brand-600 hover:text-brand-500 dark:text-brand-400">
            Return to Homepage &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
