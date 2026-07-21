import { useState, useEffect } from "react";
import { QrCode, Smartphone, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import api from "../../api/axios";
import PageMeta from "../../components/common/PageMeta";

interface WhatsappStatus {
  status: "disconnected" | "connecting" | "connected" | "error";
  qrCodeUrl?: string;
  phoneNumber?: string;
  lastConnectedAt?: string;
}

export default function WhatsAppIntegration() {
  const [statusData, setStatusData] = useState<WhatsappStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  const fetchStatus = async () => {
    try {
      const res = await api.get("/whatsapp/status");
      if (res.data.success) {
        setStatusData(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Poll for status if we are in connecting state
    const interval = setInterval(() => {
      if (statusData?.status === "connecting") {
        fetchStatus();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [statusData?.status]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const res = await api.post("/whatsapp/connect");
      if (res.data.success) {
        setStatusData({
          status: "connecting",
          qrCodeUrl: res.data.data.qrCodeUrl
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await api.post("/whatsapp/disconnect");
      setStatusData({ status: "disconnected" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <PageMeta title="WhatsApp Integration | DeployX" description="Connect Evolution API WhatsApp instance" />
      
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">WhatsApp Integration</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Connect your agency's WhatsApp number to automate candidate notifications.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <RefreshCw className="w-8 h-8 text-brand-500 animate-spin" />
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-8 items-start">
                
                {/* Left Side Info */}
                <div className="flex-1 space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Connection Status</h3>
                    
                    {statusData?.status === "connected" && (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-green-800 dark:text-green-400">Connected</p>
                          <p className="text-sm text-green-600 dark:text-green-500 mt-1">
                            Your WhatsApp instance is active and ready to send pipeline automations.
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {statusData?.status === "disconnected" && (
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-gray-500 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-800 dark:text-gray-200">Not Connected</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Generate a QR code and scan it with the WhatsApp app on your phone to link your agency account.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Features Enabled</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 text-brand-500 mr-2" />
                        Automated Pipeline Stage Notifications
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 text-brand-500 mr-2" />
                        Agent Broadcast Messaging
                      </li>
                      <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4 text-brand-500 mr-2" />
                        Incoming Message Webhooks (AI Ready)
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Right Side Action / QR */}
                <div className="w-full md:w-80 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center text-center">
                  
                  {statusData?.status === "connected" ? (
                    <>
                      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                        <Smartphone className="w-10 h-10 text-green-500" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Device Linked</h4>
                      <button 
                        onClick={handleDisconnect}
                        className="w-full py-2.5 px-4 bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors mt-4"
                      >
                        Disconnect
                      </button>
                    </>
                  ) : statusData?.status === "connecting" && statusData?.qrCodeUrl ? (
                    <>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Scan QR Code</h4>
                      <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm mb-4">
                        <img src={statusData.qrCodeUrl} alt="WhatsApp QR Code" className="w-48 h-48" />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                        Open WhatsApp on your phone &gt; Linked Devices &gt; Link a Device.
                      </p>
                      <button 
                        onClick={fetchStatus}
                        className="flex items-center justify-center text-sm text-brand-600 hover:text-brand-700 font-medium"
                      >
                        <RefreshCw className="w-4 h-4 mr-1" /> Refresh Status
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-brand-50 dark:bg-brand-500/10 rounded-full flex items-center justify-center mb-4">
                        <QrCode className="w-10 h-10 text-brand-500" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Link Device</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        Generate a secure Evolution API QR code to pair your device.
                      </p>
                      <button 
                        onClick={handleConnect}
                        disabled={connecting}
                        className="w-full py-2.5 px-4 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition-colors disabled:opacity-50"
                      >
                        {connecting ? "Generating..." : "Generate QR Code"}
                      </button>
                    </>
                  )}
                  
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
