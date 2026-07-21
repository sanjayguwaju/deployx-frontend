import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import api from "../../api/axios";
import { toast } from "react-hot-toast";
import { CreditCard, CheckCircle2 } from "lucide-react";

export default function Billing() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await api.get("/subscriptions/my");
      if (response.data.success) {
        setSubscription(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load subscription details.");
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = async (planName: string, price: number) => {
    try {
      const response = await api.post("/subscriptions/initiate-payment", { planName, price });
      if (response.data.success && response.data.data.url) {
        const { esewaPayload, url } = response.data.data;
        
        // Create an invisible form to POST to eSewa
        const form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("action", url);
        
        for (const key in esewaPayload) {
          const hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", key);
          hiddenField.setAttribute("value", esewaPayload[key]);
          form.appendChild(hiddenField);
        }
        
        document.body.appendChild(form);
        form.submit();
      }
    } catch (error) {
      toast.error("Failed to initiate payment");
    }
  };

  if (loading) return <div className="p-4 text-gray-500">Loading billing details...</div>;

  return (
    <>
      <PageMeta
        title="Billing & Subscription | DeployX"
        description="Manage your SaaS subscription and billing"
      />
      <PageBreadcrumb pageTitle="Billing & Subscription" />
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Current Plan Details */}
        <div className="p-6 bg-white border border-gray-200 rounded-2xl dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-brand-50 rounded-xl dark:bg-brand-500/10">
              <CreditCard className="text-brand-500 size-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Current Plan</h3>
              <p className="text-sm text-gray-500">View and manage your subscription</p>
            </div>
          </div>
          
          <div className="p-5 mt-6 border border-gray-100 bg-gray-50 rounded-xl dark:bg-gray-800/50 dark:border-gray-700">
            {subscription ? (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Plan Name</span>
                  <span className="font-semibold text-gray-800 dark:text-white/90">{subscription.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    subscription.status === 'active' ? 'bg-green-100 text-green-800' :
                    subscription.status === 'trial' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {subscription.status.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Expires On</span>
                  <span className="text-gray-800 dark:text-white/90">
                    {new Date(subscription.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No active subscription found. You are on the free tier.</p>
            )}
          </div>
        </div>

        {/* Upgrade Plan */}
        <div className="p-6 bg-white border border-gray-200 rounded-2xl dark:bg-gray-800 dark:border-gray-700">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">Upgrade to Premium</h3>
          <p className="mb-6 text-sm text-gray-500">Get access to unlimited wards, priority support, and advanced modules.</p>
          
          <div className="p-5 border border-brand-100 bg-brand-50 rounded-xl dark:bg-brand-500/10 dark:border-brand-500/20">
            <h4 className="mb-2 text-xl font-bold text-gray-800 dark:text-white/90">NPR 15,000 <span className="text-sm font-normal text-gray-500">/ year</span></h4>
            
            <ul className="my-6 space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle2 className="text-brand-500 size-4" /> Unlimited Wards & Users
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle2 className="text-brand-500 size-4" /> All Municipality Modules
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle2 className="text-brand-500 size-4" /> Priority Support 24/7
              </li>
            </ul>

            <button 
              onClick={() => initiatePayment("Premium", 15000)}
              className="w-full px-4 py-2 font-medium text-white transition-colors rounded-lg bg-brand-500 hover:bg-brand-600"
            >
              Pay via eSewa
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
