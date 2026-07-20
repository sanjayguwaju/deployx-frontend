import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

export default function BillingVerify() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifying" | "success" | "failed">("verifying");

  useEffect(() => {
    const data = searchParams.get("data");
    if (data) {
      verifyPayment(data);
    } else {
      setStatus("failed");
      toast.error("Invalid payment payload");
      setTimeout(() => navigate("/billing"), 2000);
    }
  }, [searchParams]);

  const verifyPayment = async (data: string) => {
    try {
      const response = await api.get(`/subscriptions/verify-payment?data=${data}`);
      if (response.data.success) {
        setStatus("success");
        toast.success("Payment successful! Your subscription is active.");
      } else {
        setStatus("failed");
        toast.error("Payment verification failed.");
      }
    } catch (error) {
      setStatus("failed");
      toast.error("An error occurred during verification.");
    } finally {
      setTimeout(() => navigate("/billing"), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {status === "verifying" && (
        <div className="text-center">
          <div className="w-12 h-12 mb-4 border-4 border-t-transparent rounded-full animate-spin border-brand-500"></div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Verifying Payment...</h2>
          <p className="mt-2 text-gray-500">Please wait while we confirm with eSewa.</p>
        </div>
      )}
      {status === "success" && (
        <div className="text-center text-green-600">
          <h2 className="text-2xl font-bold">Payment Successful!</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Redirecting to billing dashboard...</p>
        </div>
      )}
      {status === "failed" && (
        <div className="text-center text-red-600">
          <h2 className="text-2xl font-bold">Payment Failed</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Redirecting to billing dashboard...</p>
        </div>
      )}
    </div>
  );
}
