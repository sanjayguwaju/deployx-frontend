import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Sparkles, CheckCircle2, FileText, Loader2, ArrowRight } from "lucide-react";
import api from "../../api/axios";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";

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
  const [extractedData, setExtractedData] = useState<Record<string, any> | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  
  // For confirmation
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await api.get("/candidates?pageSize=100");
        if (response.data.success) {
          const raw = response.data.data;
          setCandidates(Array.isArray(raw) ? raw : raw.candidates || raw.data || []);
        }
      } catch (error) {
        console.error("Failed to load candidates");
      }
    };
    fetchCandidates();
  }, []);

  const handleExtract = async () => {
    if (!documentUrl) {
      toast.error("Please provide a document image URL");
      return;
    }

    setIsExtracting(true);
    setExtractedData(null);
    setConfidence(null);

    try {
      const response = await api.post("/ai/documents/test/extract", {
        documentUrl,
        type: documentType,
      });
      
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
    if (!extractedData) return;
    setExtractedData({
      ...extractedData,
      [key]: value,
    });
  };

  const handleConfirm = async () => {
    if (!selectedCandidate) {
      toast.error("Please select a candidate to attach this data to");
      return;
    }

    setIsSaving(true);
    try {
      await api.post("/ai/documents/test/confirm-extraction", {
        candidateId: selectedCandidate,
        extractedData,
      });
      
      toast.success("Document data saved to candidate profile successfully!");
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
    <>
      <PageMeta
        title="AI Document Parser | DeployX"
        description="Extract candidate details from passports and visas using AI OCR."
      />
      <PageBreadcrumb pageTitle="AI Document Parser (OCR)" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Side: Upload & Preview */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center gap-2 pb-3 mb-3 border-b border-gray-100 dark:border-white/5">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
              Document Input
            </h3>
          </div>
          
          <div className="space-y-3.5">
            <div>
              <Label htmlFor="docType">Document Category</Label>
              <select 
                id="docType"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
              >
                <option value="passport">Passport (Bio Page)</option>
                <option value="visa">Employment Visa Stamping</option>
                <option value="medical_report">GAMCA / Medical Fitness Report</option>
              </select>
            </div>

            <div>
              <Label htmlFor="docUrl">Document Image URL</Label>
              <Input 
                id="docUrl"
                type="text" 
                placeholder="https://example.com/sample-passport.jpg"
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
                className="h-9 text-xs"
              />
              <p className="text-[11px] text-gray-400 mt-1">Direct publicly-accessible link to a scanned image or PDF screenshot.</p>
            </div>

            {documentUrl && (
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-2 h-56 flex items-center justify-center bg-gray-50/70 dark:bg-gray-900/50 overflow-hidden">
                <img
                  src={documentUrl}
                  alt="Document Preview"
                  className="max-h-full max-w-full object-contain rounded"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </div>
            )}

            <Button 
              type="button"
              onClick={handleExtract}
              disabled={isExtracting || !documentUrl}
              className="w-full flex items-center justify-center gap-2"
              size="sm"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Extracting via Vision AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run OCR Extraction</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right Side: Extraction Results */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/5 dark:bg-white/3">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-500" />
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                Extracted Data
              </h3>
            </div>
            {confidence !== null && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                confidence > 0.85
                  ? "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
              }`}>
                <CheckCircle2 className="w-3 h-3" />
                Confidence: {(confidence * 100).toFixed(1)}%
              </span>
            )}
          </div>
          
          {!extractedData ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
              <FileText className="w-8 h-8 mb-2 text-gray-300 dark:text-gray-600" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Awaiting document extraction...</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Submit an image URL on the left to extract structured fields.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {Object.entries(extractedData).map(([key, value]) => (
                  <div key={key}>
                    <Label htmlFor={key} className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <Input 
                      id={key}
                      type="text" 
                      value={typeof value === 'object' ? JSON.stringify(value) : (value as string ?? "")}
                      onChange={(e) => handleDataChange(key, e.target.value)}
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-white/5 space-y-3">
                <div>
                  <Label htmlFor="candidateSelect">Assign to Candidate Profile</Label>
                  <select
                    id="candidateSelect"
                    value={selectedCandidate}
                    onChange={(e) => setSelectedCandidate(e.target.value)}
                    className="h-9 w-full rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90"
                  >
                    <option value="">-- Choose Candidate --</option>
                    {candidates.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.firstName} {c.lastName} ({c.passportNumber || "No Passport"})
                      </option>
                    ))}
                  </select>
                </div>

                <Button 
                  type="button"
                  onClick={handleConfirm}
                  disabled={isSaving || !selectedCandidate}
                  className="w-full flex items-center justify-center gap-1.5"
                  size="sm"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm & Save to Candidate</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
