import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

interface Candidate {
  _id: string;
  firstName: string;
  lastName: string;
  passportNumber?: string;
}

export default function SmartDocumentParser() {
  const [documentUrl, setDocumentUrl] = useState("");
  const [documentType, setDocumentType] = useState("passport");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  
  // For confirmation
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Fetch candidates so user can assign the parsed data
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`${API_URL}/candidates?pageSize=100`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setCandidates(response.data.data);
      } catch (error) {
        console.error("Failed to load candidates");
      }
    };
    fetchCandidates();
  }, []);

  const handleExtract = async () => {
    if (!documentUrl) {
      toast.error("Please provide a document URL");
      return;
    }

    setIsExtracting(true);
    setExtractedData(null);
    setConfidence(null);

    try {
      const response = await axios.post(
        `${API_URL}/ai/documents/test/extract`,
        { documentUrl, type: documentType },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      const payload = response.data.data;
      setExtractedData(payload.extractedData);
      setConfidence(payload.confidence);
      toast.success(response.data.message || "Extraction complete");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to extract document data");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleDataChange = (key: string, value: string) => {
    setExtractedData({
      ...extractedData,
      [key]: value
    });
  };

  const handleConfirm = async () => {
    if (!selectedCandidate) {
      toast.error("Please select a candidate to attach this data to");
      return;
    }

    setIsSaving(true);
    try {
      await axios.post(
        `${API_URL}/ai/documents/test/confirm-extraction`,
        { candidateId: selectedCandidate, extractedData },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      toast.success("Document data saved to candidate successfully!");
      // Reset
      setExtractedData(null);
      setDocumentUrl("");
      setSelectedCandidate("");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save data");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Smart Document Parser (OCR)</h2>
        <p className="text-gray-500 mt-1">Upload a Passport or Visa to instantly extract data using AI Vision.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Upload & Preview */}
        <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm border border-gray-100 dark:border-strokedark p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upload Document</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Document Type</label>
              <select 
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full border rounded p-2 dark:bg-meta-4 dark:border-strokedark"
              >
                <option value="passport">Passport</option>
                <option value="visa">Visa</option>
                <option value="medical_report">Medical Report</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Document Image URL</label>
              <input 
                type="text" 
                placeholder="https://example.com/sample-passport.jpg"
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
                className="w-full border rounded p-2 dark:bg-meta-4 dark:border-strokedark"
              />
              <p className="text-xs text-gray-500 mt-1">For MVP, paste a direct URL to an image.</p>
            </div>

            {documentUrl && (
              <div className="mt-4 border rounded p-2 h-64 flex items-center justify-center bg-gray-50 dark:bg-meta-4 overflow-hidden">
                <img src={documentUrl} alt="Document Preview" className="max-h-full max-w-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
              </div>
            )}

            <button 
              onClick={handleExtract}
              disabled={isExtracting || !documentUrl}
              className={`w-full py-3 rounded font-medium text-white transition-colors flex justify-center items-center gap-2 ${
                isExtracting || !documentUrl ? "bg-brand-400 cursor-not-allowed" : "bg-brand-600 hover:bg-brand-700"
              }`}
            >
              {isExtracting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Extracting via AI Vision...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  Extract Data
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Extraction Results */}
        <div className="bg-white dark:bg-boxdark rounded-lg shadow-sm border border-gray-100 dark:border-strokedark p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Extraction Results</h3>
          
          {!extractedData ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-strokedark rounded-lg">
              <svg className="w-12 h-12 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <p>Awaiting extraction...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {confidence && (
                <div className={`p-3 rounded flex items-center gap-2 text-sm font-medium ${
                  confidence > 0.9 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                }`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  AI Confidence Score: {(confidence * 100).toFixed(1)}%
                </div>
              )}

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {Object.entries(extractedData).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <input 
                      type="text" 
                      value={value as string}
                      onChange={(e) => handleDataChange(key, e.target.value)}
                      className="w-full border rounded p-2 dark:bg-meta-4 dark:border-strokedark font-medium text-gray-900 dark:text-white"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-strokedark">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assign to Candidate</label>
                <select
                  value={selectedCandidate}
                  onChange={(e) => setSelectedCandidate(e.target.value)}
                  className="w-full border rounded p-2 mb-4 dark:bg-meta-4 dark:border-strokedark"
                >
                  <option value="">-- Select Candidate --</option>
                  {candidates.map(c => (
                    <option key={c._id} value={c._id}>
                      {c.firstName} {c.lastName} ({c.passportNumber || "No Passport"})
                    </option>
                  ))}
                </select>

                <button 
                  onClick={handleConfirm}
                  disabled={isSaving || !selectedCandidate}
                  className={`w-full py-2 rounded font-medium text-white transition-colors ${
                    isSaving || !selectedCandidate ? "bg-brand-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {isSaving ? "Saving..." : "Confirm & Save to Profile"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
