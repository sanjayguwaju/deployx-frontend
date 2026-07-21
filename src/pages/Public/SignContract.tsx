import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

interface ContractDetails {
  _id: string;
  signatureStatus: string;
  pdfUrl?: string;
  candidate?: {
    firstName: string;
    lastName: string;
    passportNumber: string;
  };
  employer?: {
    companyName: string;
  };
}

export default function SignContract() {
  const { id } = useParams<{ id: string }>();
  const [contract, setContract] = useState<ContractDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    fetchContract();
  }, [id]);

  const fetchContract = async () => {
    try {
      const response = await axios.get(`${API_URL}/contracts/${id}/public`);
      setContract(response.data.data);
    } catch (error) {
      toast.error("Failed to load contract details");
    } finally {
      setLoading(false);
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";

    const rect = canvas.getBoundingClientRect();
    let x = 0;
    let y = 0;

    if (e.type.includes("touch")) {
      const touch = (e as React.TouchEvent).touches[0];
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    } else {
      const mouse = e as React.MouseEvent;
      x = mouse.clientX - rect.left;
      y = mouse.clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const submitSignature = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check if canvas is actually drawn on (simple check, assume it's blank if it's perfectly clean)
    // A better check would look at pixel data, but we'll trust the user for MVP.
    const dataUrl = canvas.toDataURL("image/png");

    setSigning(true);
    try {
      await axios.post(`${API_URL}/contracts/${id}/public/sign`, {
        signatureUrl: dataUrl,
        signerType: "candidate" // For MVP, assuming candidate is signing
      });
      toast.success("Contract signed successfully!");
      fetchContract();
    } catch (error) {
      toast.error("Failed to sign contract");
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Contract not found or invalid link.
      </div>
    );
  }

  const isSigned = contract.signatureStatus === "fully_signed" || contract.signatureStatus === "signed_candidate";

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-brand-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Employment Contract Signature Portal</h2>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Contract Details</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-700"><strong>Candidate:</strong> {contract.candidate?.firstName} {contract.candidate?.lastName}</p>
              <p className="text-gray-700 mt-1"><strong>Employer:</strong> {contract.employer?.companyName}</p>
              <p className="text-gray-700 mt-1"><strong>Status:</strong> <span className="uppercase text-sm font-semibold text-brand-600">{contract.signatureStatus.replace("_", " ")}</span></p>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              Please review your contract terms. By signing below, you agree to the conditions set forth in the employment agreement.
            </p>
          </div>

          {isSigned ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="text-green-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-green-900">Contract Signed</h3>
              <p className="text-green-700 mt-2">Thank you! Your signature has been securely recorded.</p>
              <a 
                href={`${API_URL}/contracts/${id}/pdf`}
                download
                className="mt-6 inline-block bg-white text-green-700 font-semibold px-4 py-2 rounded border border-green-300 hover:bg-green-100 transition-colors"
              >
                Download PDF Copy
              </a>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sign Below</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 mb-4">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={200}
                  className="w-full h-[200px] cursor-crosshair touch-none"
                  onMouseDown={startDrawing}
                  onMouseUp={stopDrawing}
                  onMouseOut={stopDrawing}
                  onMouseMove={draw}
                  onTouchStart={startDrawing}
                  onTouchEnd={stopDrawing}
                  onTouchMove={draw}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <button
                  onClick={clearCanvas}
                  className="text-gray-500 hover:text-gray-700 font-medium text-sm"
                >
                  Clear Signature
                </button>
                <button
                  onClick={submitSignature}
                  disabled={signing}
                  className={`px-6 py-2 rounded-lg font-medium text-white transition-colors ${
                    signing ? "bg-brand-400 cursor-not-allowed" : "bg-brand-600 hover:bg-brand-700"
                  }`}
                >
                  {signing ? "Saving..." : "Submit Signature"}
                </button>
              </div>
            </div>
          )}

        </div>
        
        <div className="bg-gray-50 px-6 py-4 text-center text-sm text-gray-500 border-t border-gray-200">
          Powered by DeployX OS &copy; {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
}
