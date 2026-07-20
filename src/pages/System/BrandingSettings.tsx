import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import api from "../../api/axios";
import { useTenant } from "../../context/TenantContext";
import { CloudUpload, Palette, Check, X, Image as ImageIcon } from "lucide-react";
import imageCompression from "browser-image-compression";

const PRESET_COLORS = [
  { name: "Slate (Default)", hex: "#1C2434" },
  { name: "Government Red", hex: "#DC2626" },
  { name: "Municipal Blue", hex: "#2563EB" },
  { name: "Forest Green", hex: "#16A34A" },
  { name: "Royal Purple", hex: "#7C3AED" },
  { name: "Deep Teal", hex: "#0D9488" },
];

export default function BrandingSettings() {
  const { branding, refreshBranding } = useTenant();

  const [name, setName] = useState(branding?.name || "");
  const [logoUrl, setLogoUrl] = useState(branding?.logoUrl || "");
  const [primaryColor, setPrimaryColor] = useState(branding?.primaryColor || "#1C2434");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (branding) {
      setName(branding.name || "");
      setLogoUrl(branding.logoUrl || "");
      setPrimaryColor(branding.primaryColor || "#1C2434");
    }
  }, [branding]);

  const handleFileUpload = async (file?: File) => {
    if (!file) return;

    setIsUploading(true);

    try {
      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: "image/webp",
      };
      const compressedFile = await imageCompression(file, options);

      const formData = new FormData();
      formData.append("file", compressedFile, compressedFile.name);
      formData.append("type", "logo");

      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.success && res.data.data.url) {
        setLogoUrl(res.data.data.url);
        toast.success("Logo uploaded successfully");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to upload logo");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };
  
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };
  
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.patch("/system/tenant/settings", {
        name,
        logoUrl,
        primaryColor,
      });

      if (res.data?.success) {
        toast.success("Branding updated successfully!");
        await refreshBranding();
      }
    } catch (error) {
      toast.error("Failed to update branding settings");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Branding Settings | PalikaOS"
        description="Update your municipality branding"
      />
      <PageBreadcrumb pageTitle="Branding Settings" />
      
      <div className="mx-auto max-w-5xl space-y-8">
        
        {/* Header Description */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tenant Branding</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Customize the look and feel of your municipality's portal. These changes will be visible to both staff and citizens.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Settings Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Municipality Name Section */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/3">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Municipality Name
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  This name will be displayed in the sidebar and emails.
                </p>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. PalikaOS Rural Municipality"
                className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-800 dark:text-white/90 dark:focus:border-brand-400"
              />
            </div>

            {/* Logo Section */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/3">
              <div className="mb-4 flex items-center gap-2">
                <div className="p-2 bg-brand-50 text-brand-600 rounded-lg dark:bg-brand-500/10 dark:text-brand-400">
                  <ImageIcon size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Municipality Logo
                </h3>
              </div>
              
              <div 
                className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all ${
                  isDragActive 
                    ? "border-brand-500 bg-brand-50 dark:border-brand-400 dark:bg-brand-500/10" 
                    : "border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700/50"
                }`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
              >
                {logoUrl ? (
                  <div className="relative group">
                    <div className="h-32 w-32 rounded-lg bg-white p-2 shadow-sm border border-gray-100 dark:border-gray-700 dark:bg-gray-900 overflow-hidden flex items-center justify-center">
                      <img src={logoUrl} alt="Municipality Logo" className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setLogoUrl("")}
                        className="rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
                        title="Remove logo"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 rounded-full bg-white p-4 shadow-sm dark:bg-gray-900">
                      <CloudUpload className="h-8 w-8 text-brand-500 dark:text-brand-400" />
                    </div>
                    <h4 className="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
                      Click to upload or drag and drop
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, or JPG (max. 2MB). Transparent background recommended.
                    </p>
                  </>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e.target.files?.[0])}
                  disabled={isUploading}
                />
              </div>
            </div>

            {/* Color Section */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/3">
              <div className="mb-4 flex items-center gap-2">
                <div className="p-2 bg-brand-50 text-brand-600 rounded-lg dark:bg-brand-500/10 dark:text-brand-400">
                  <Palette size={20} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                  Primary Brand Color
                </h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Predefined Colors</p>
                  <div className="flex flex-wrap gap-3">
                    {PRESET_COLORS.map((preset) => (
                      <button
                        key={preset.hex}
                        onClick={() => setPrimaryColor(preset.hex)}
                        className={`group relative h-10 w-10 rounded-full border-2 shadow-sm transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                          primaryColor.toUpperCase() === preset.hex.toUpperCase() 
                            ? "border-white ring-2 ring-gray-400 dark:border-gray-800 dark:ring-gray-500 scale-110" 
                            : "border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                        }`}
                        style={{ backgroundColor: preset.hex }}
                        title={preset.name}
                      >
                        {primaryColor.toUpperCase() === preset.hex.toUpperCase() && (
                          <Check size={16} className="absolute inset-0 m-auto text-white drop-shadow-md" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Custom Color</p>
                  <div className="flex items-center gap-3">
                    <div className="relative flex items-center h-10 w-32 rounded-lg border border-gray-300 bg-white px-3 shadow-sm focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 dark:border-gray-700 dark:bg-gray-800">
                      <div 
                        className="h-4 w-4 rounded-full border border-gray-200 dark:border-gray-600 shadow-inner shrink-0"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="ml-2 w-full border-0 bg-transparent p-0 text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white uppercase"
                        maxLength={7}
                      />
                    </div>
                    <label className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                      <Palette size={16} className="text-gray-500 dark:text-gray-400" />
                      <input 
                        type="color" 
                        value={primaryColor} 
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setLogoUrl(branding?.logoUrl || "");
                  setPrimaryColor(branding?.primaryColor || "#1C2434");
                }}
                disabled={isSubmitting}
                className="px-6"
              >
                Reset
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isSubmitting || isUploading}
                className="px-6 text-white"
                style={{ backgroundColor: primaryColor }}
              >
                {isSubmitting ? "Saving Changes..." : "Save Branding Settings"}
              </Button>
            </div>
            
          </div>

          {/* Sidebar - Live Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/3">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Live Preview
              </h3>
              
              <div className="space-y-6">
                {/* Navbar Mockup */}
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700/50 dark:bg-gray-800/50">
                  <div className="mb-3 flex items-center gap-3">
                    {logoUrl ? (
                      <div className="h-8 w-8 rounded bg-white p-1 shadow-sm flex items-center justify-center">
                        <img src={logoUrl} alt="Logo" className="max-h-full max-w-full object-contain" />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    )}
                    <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-2 w-12 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-2 w-12 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-2 w-12 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                </div>

                {/* UI Elements Mockup */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <button 
                      className="rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Primary Button
                    </button>
                    <span 
                      className="rounded-full px-2.5 py-0.5 text-xs font-medium bg-opacity-10 border"
                      style={{ 
                        color: primaryColor, 
                        backgroundColor: `${primaryColor}15`,
                        borderColor: `${primaryColor}30`
                      }}
                    >
                      Active Badge
                    </span>
                  </div>
                  
                  {/* Sidebar Mockup */}
                  <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="border-b border-gray-100 p-3 dark:border-gray-700">
                      <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                    </div>
                    <div className="p-2 space-y-1">
                      <div className="flex items-center gap-2 rounded-lg p-2 bg-opacity-10" style={{ backgroundColor: `${primaryColor}15` }}>
                        <div className="h-4 w-4 rounded opacity-80" style={{ backgroundColor: primaryColor }} />
                        <div className="h-2.5 w-20 rounded font-medium opacity-90" style={{ backgroundColor: primaryColor }} />
                      </div>
                      <div className="flex items-center gap-2 rounded-lg p-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <div className="h-4 w-4 rounded bg-gray-300 dark:bg-gray-600" />
                        <div className="h-2.5 w-24 rounded bg-gray-300 dark:bg-gray-600" />
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
