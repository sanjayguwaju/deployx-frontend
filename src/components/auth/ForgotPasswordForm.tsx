import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import api from "../../api/axios";
import { toast } from "react-hot-toast";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/forgot-password", { email });
      if (response.data.success) {
        setSuccess(true);
        toast.success(response.data.message || "Reset link sent!");
      } else {
        const msg = response.data.message || "Failed to send reset link.";
        setError(msg);
        toast.error(msg);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "An error occurred.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col flex-1">
        <div className="w-full max-w-md pt-10 mx-auto">
          <Link
            to="/signin"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon className="size-5" />
            Back to Sign In
          </Link>
        </div>
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto text-center">
          <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
            Check Your Email
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            If an account exists with {email}, we have sent a password reset link. Please check your inbox and spam folder.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/signin"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Back to Sign In
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Forgot Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>
          </div>
          <div>
            {error && (
              <div className="p-3 mb-4 text-sm text-red-500 bg-red-100 rounded-lg">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input 
                    type="email"
                    placeholder="info@gmail.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Button type="submit" className="w-full" size="sm" disabled={loading}>
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
