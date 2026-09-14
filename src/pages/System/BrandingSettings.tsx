import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import api from "../../api/axios";
import { useTenant } from "../../context/TenantContext";
import { 
  CloudUpload, 
  Palette, 
  Check, 
  X, 
  Image as ImageIcon,
  Building2,
  Globe,
  ShieldCheck,
  Eye
} from "lucide-react";
import imageCompression from "browser-image-compression";

const PRESET_COLORS = [
  { name: "Executive Slate (Default)", hex: "#1C2434" },
  { name: "Corporate Blue", hex: "#2563EB" },
  { name: "Gulf Amber", hex: "#D97706" },
  { name: "Emerald Prosperity", hex: "#059669" },
  { name: "Royal Navy", hex: "#1E3A8A" },
  { name: "Crimson Red", hex: "#DC2626" },
];

export default function BrandingSettings() {
  const { branding, refreshBranding } = useTenant();

  // Agency Identity State
  const [name, setName] = useState(branding?.name || "");
  const [licenseNumber, setLicenseNumber] = useState(branding?.licenseNumber || "");
  const [tagline, setTagline] = useState(branding?.tagline || "");
  const [logoUrl, setLogoUrl] = useState(branding?.logoUrl || "");
  const [faviconUrl, setFaviconUrl] = useState(branding?.faviconUrl || "");

  // Colors
  const [primaryColor, setPrimaryColor] = useState(branding?.primaryColor || "#1C2434");
  const [secondaryColor, setSecondaryColor] = useState(branding?.secondaryColor || "#2563EB");

  // Contact Details
  const [contactEmail, setContactEmail] = useState(branding?.contactEmail || "");
  const [contactPhone, setContactPhone] = useState(branding?.contactPhone || "");
  const [address, setAddress] = useState(branding?.address || "");

  // White Labeling Options
  const [customDomain, setCustomDomain] = useState(branding?.customDomain || "");
  const [emailSenderName, setEmailSenderName] = useState(branding?.emailSenderName || "");
  const [hidePoweredBy, setHidePoweredBy] = useState(branding?.hidePoweredBy || false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  const [isDragActiveLogo, setIsDragActiveLogo] = useState(false);
  const [isDragActiveFavicon, setIsDragActiveFavicon] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (branding) {
      setName(branding.name || "");
      setLicenseNumber(branding.licenseNumber || "");
      setTagline(branding.tagline || "");
      setLogoUrl(branding.logoUrl || "");
      setFaviconUrl(branding.faviconUrl || "");
      setPrimaryColor(branding.primaryColor || "#1C2434");
      setSecondaryColor(branding.secondaryColor || "#2563EB");
      setContactEmail(branding.contactEmail || "");
      setContactPhone(branding.contactPhone || "");
      setAddress(branding.address || "");
      setCustomDomain(branding.customDomain || "");
      setEmailSenderName(branding.emailSenderName || "");
      setHidePoweredBy(branding.hidePoweredBy || false);
    }
  }, [branding]);

  const handleFileUpload = async (file: File | undefined, type: "logo" | "favicon") => {
    if (!file) return;

    if (type === "logo") setIsUploadingLogo(true);
    else setIsUploadingFavicon(true);

    try {
      const options = {
        maxSizeMB: type === "favicon" ? 0.5 : 2,
        maxWidthOrHeight: type === "favicon" ? 256 : 1920,
        useWebWorker: true,
        fileType: "image/webp",
      };
      const compressedFile = await imageCompression(file, options);

      const formData = new FormData();
      formData.append("file", compressedFile, compressedFile.name);
      formData.append("type", type);

      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.success && res.data.data.url) {
        if (type === "logo") {
          setLogoUrl(res.data.data.url);
          toast.success("Agency logo uploaded successfully");
        } else {
          setFaviconUrl(res.data.data.url);
          toast.success("Favicon uploaded successfully");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Failed to upload image");
      console.error(error);
    } finally {
      if (type === "logo") setIsUploadingLogo(false);
      else setIsUploadingFavicon(false);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.patch("/system/tenant/settings", {
        name,
        licenseNumber,
        tagline,
        logoUrl,
        faviconUrl,
        primaryColor,
        secondaryColor,
        contactEmail,
        contactPhone,
        address,
        customDomain,
        emailSenderName,
        hidePoweredBy,
      });

      if (res.data?.success) {
        toast.success("Agency white-label settings updated!");
        await refreshBranding();
      }
    } catch (error) {
      toast.error("Failed to update white-label settings");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (branding) {
      setName(branding.name || "");
      setLicenseNumber(branding.licenseNumber || "");
      setTagline(branding.tagline || "");
      setLogoUrl(branding.logoUrl || "");
      setFaviconUrl(branding.faviconUrl || "");
      setPrimaryColor(branding.primaryColor || "#1C2434");
      setSecondaryColor(branding.secondaryColor || "#2563EB");
      setContactEmail(branding.contactEmail || "");
      setContactPhone(branding.contactPhone || "");
      setAddress(branding.address || "");
      setCustomDomain(branding.customDomain || "");
      setEmailSenderName(branding.emailSenderName || "");
      setHidePoweredBy(branding.hidePoweredBy || false);
    }
  };

  return (
    <>
      <PageMeta
        title="Agency White-Labelling & Branding | DeployX"
        description="White-label your overseas manpower recruitment agency portal, custom branding, domain, colors, and portal badges."
      />
      <PageBreadcrumb pageTitle="Agency White-Labelling" />
      
      <div className="mx-auto max-w-6xl space-y-6">
        
        {/* Header Description */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-boxdark p-5 rounded-xl border border-gray-200 dark:border-strokedark shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-500" />
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Agency White-Labelling & Branding</h2>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Customize your overseas manpower recruitment agency identity across portals, candidate communications, emails, and contracts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              White-Label Active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Settings Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Agency Identity */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-strokedark dark:bg-boxdark">
              <div className="mb-4 pb-3 border-b border-gray-100 dark:border-strokedark/60 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Agency Identity
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Official business credentials visible to foreign employers and job seekers.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Agency Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Global Recruitment Agency Pvt. Ltd."
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Govt. Manpower License / Reg No.
                  </label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="e.g. Govt. License #1480/080"
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Agency Tagline / Slogan
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="e.g. Overseas Recruitment & Global Manpower Solutions"
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* 2. Visual Assets (Logo & Favicon) */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-strokedark dark:bg-boxdark">
              <div className="mb-4 pb-3 border-b border-gray-100 dark:border-strokedark/60">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Brand Assets & Logos
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  High-resolution brand logos displayed in navigation bars, generated PDF contracts, and candidate receipts.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Agency Logo */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Primary Agency Logo (Sidebar & Header)
                  </label>
                  <div 
                    className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center transition-all ${
                      isDragActiveLogo 
                        ? "border-brand-500 bg-brand-50/50 dark:bg-brand-950/20" 
                        : "border-gray-300 bg-gray-50/60 hover:bg-gray-100/60 dark:border-gray-700 dark:bg-gray-800/40"
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragActiveLogo(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDragActiveLogo(false); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragActiveLogo(false);
                      if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0], "logo");
                    }}
                  >
                    {logoUrl ? (
                      <div className="relative group">
                        <div className="h-20 w-32 rounded bg-white p-2 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden">
                          <img src={logoUrl} alt="Agency Logo" className="max-h-full max-w-full object-contain" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center rounded bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            type="button"
                            onClick={() => setLogoUrl("")}
                            className="rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600"
                            title="Remove logo"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <CloudUpload className="h-7 w-7 text-brand-500 mb-1" />
                        <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                          {isUploadingLogo ? "Uploading..." : "Upload Agency Logo"}
                        </span>
                        <span className="text-[11px] text-gray-400 mt-0.5">
                          SVG, PNG, JPG (max. 2MB)
                        </span>
                      </>
                    )}
                    <input
                      ref={logoInputRef}
                      type="file"
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files?.[0], "logo")}
                      disabled={isUploadingLogo}
                    />
                  </div>
                </div>

                {/* Favicon */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Browser Tab Favicon (32x32)
                  </label>
                  <div 
                    className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-4 text-center transition-all ${
                      isDragActiveFavicon 
                        ? "border-brand-500 bg-brand-50/50 dark:bg-brand-950/20" 
                        : "border-gray-300 bg-gray-50/60 hover:bg-gray-100/60 dark:border-gray-700 dark:bg-gray-800/40"
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragActiveFavicon(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDragActiveFavicon(false); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragActiveFavicon(false);
                      if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0], "favicon");
                    }}
                  >
                    {faviconUrl ? (
                      <div className="relative group">
                        <div className="h-20 w-20 rounded bg-white p-2 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden">
                          <img src={faviconUrl} alt="Favicon" className="max-h-full max-w-full object-contain" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center rounded bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            type="button"
                            onClick={() => setFaviconUrl("")}
                            className="rounded-full bg-red-500 p-1.5 text-white hover:bg-red-600"
                            title="Remove favicon"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="h-7 w-7 text-gray-400 mb-1" />
                        <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                          {isUploadingFavicon ? "Uploading..." : "Upload Favicon"}
                        </span>
                        <span className="text-[11px] text-gray-400 mt-0.5">
                          ICO, PNG (Square, 32x32)
                        </span>
                      </>
                    )}
                    <input
                      ref={faviconInputRef}
                      type="file"
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files?.[0], "favicon")}
                      disabled={isUploadingFavicon}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Theme Colors */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-strokedark dark:bg-boxdark">
              <div className="mb-4 pb-3 border-b border-gray-100 dark:border-strokedark/60 flex items-center gap-2">
                <Palette className="w-4 h-4 text-brand-500" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Brand Color Palette
                </h3>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300 mb-2.5">Preset Agency Palettes</p>
                  <div className="flex flex-wrap gap-2.5">
                    {PRESET_COLORS.map((preset) => (
                      <button
                        key={preset.hex}
                        type="button"
                        onClick={() => setPrimaryColor(preset.hex)}
                        className={`group relative h-9 w-9 rounded-full border shadow-sm transition-all hover:scale-105 focus:outline-none ${
                          primaryColor.toUpperCase() === preset.hex.toUpperCase() 
                            ? "ring-2 ring-brand-500 scale-105 border-white" 
                            : "border-gray-200 dark:border-gray-700"
                        }`}
                        style={{ backgroundColor: preset.hex }}
                        title={preset.name}
                      >
                        {primaryColor.toUpperCase() === preset.hex.toUpperCase() && (
                          <Check size={14} className="absolute inset-0 m-auto text-white drop-shadow" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Custom Primary Brand Color
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex items-center h-9 flex-1 rounded-lg border border-gray-300 bg-white px-2.5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div 
                          className="h-4 w-4 rounded-full border border-gray-200 dark:border-gray-600 shadow-inner shrink-0"
                          style={{ backgroundColor: primaryColor }}
                        />
                        <input
                          type="text"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="ml-2 w-full border-0 bg-transparent p-0 text-xs font-mono font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white uppercase"
                          maxLength={7}
                        />
                      </div>
                      <label className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                        <Palette size={14} className="text-gray-500 dark:text-gray-400" />
                        <input 
                          type="color" 
                          value={primaryColor} 
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Secondary / Accent Color
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex items-center h-9 flex-1 rounded-lg border border-gray-300 bg-white px-2.5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <div 
                          className="h-4 w-4 rounded-full border border-gray-200 dark:border-gray-600 shadow-inner shrink-0"
                          style={{ backgroundColor: secondaryColor }}
                        />
                        <input
                          type="text"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="ml-2 w-full border-0 bg-transparent p-0 text-xs font-mono font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white uppercase"
                          maxLength={7}
                        />
                      </div>
                      <label className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                        <Palette size={14} className="text-gray-500 dark:text-gray-400" />
                        <input 
                          type="color" 
                          value={secondaryColor} 
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Contact & Office Address */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-strokedark dark:bg-boxdark">
              <div className="mb-4 pb-3 border-b border-gray-100 dark:border-strokedark/60">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Official Contact & Address
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Appears on candidate deployment contracts, visa submission sheets, and invoice headers.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Official Support Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g. info@globalrecruitment.com"
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hotline / Phone Number
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="e.g. +977 1 4455667"
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Head Office Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Ring Road, Battisputali, Kathmandu, Nepal"
                    className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* 5. Custom Domain & Portal White-Labelling */}
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-strokedark dark:bg-boxdark">
              <div className="mb-4 pb-3 border-b border-gray-100 dark:border-strokedark/60 flex items-center gap-2">
                <Globe className="w-4 h-4 text-brand-500" />
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    Custom Domain & Portal White-Labelling
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Connect your own domain name and remove DeployX vendor watermarks.
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Custom Domain / Subdomain
                    </label>
                    <input
                      type="text"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      placeholder="e.g. portal.globalrecruitment.com"
                      className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-600"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      Add a CNAME record pointing to your DeployX cluster.
                    </p>
                  </div>

                  <div>
                    <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Sender Display Name
                    </label>
                    <input
                      type="text"
                      value={emailSenderName}
                      onChange={(e) => setEmailSenderName(e.target.value)}
                      placeholder="e.g. Global Recruitment HR Desk"
                      className="w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-xs text-gray-900 dark:text-white outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-600"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      Used when dispatching visa updates and offer letters.
                    </p>
                  </div>
                </div>

                {/* Hide Powered By Toggle */}
                <div className="pt-3 border-t border-gray-100 dark:border-strokedark/50 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Hide "Powered by DeployX" Watermark
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Removes vendor footer branding from candidate tracking portals and client portals.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hidePoweredBy}
                      onChange={(e) => setHidePoweredBy(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-500 dark:bg-gray-700"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Save Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs"
              >
                Discard Changes
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isSubmitting || isUploadingLogo || isUploadingFavicon}
                className="px-5 py-2 text-xs text-white"
                style={{ backgroundColor: primaryColor }}
              >
                {isSubmitting ? "Saving..." : "Save White-Label Settings"}
              </Button>
            </div>
            
          </div>

          {/* Live Preview Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-strokedark dark:bg-boxdark space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-strokedark/60 pb-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-brand-500" />
                  Live Brand Preview
                </h3>
                <span className="text-[10px] text-brand-600 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded-full font-mono">
                  Real-time
                </span>
              </div>
              
              {/* 1. Header Bar Preview */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-gray-400">Portal Top Bar:</span>
                <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-xs dark:border-strokedark dark:bg-meta-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="h-6 w-6 object-contain rounded" />
                    ) : (
                      <div 
                        className="h-6 w-6 rounded flex items-center justify-center font-bold text-white text-[11px]"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {name?.charAt(0) || "A"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-bold text-xs text-gray-900 dark:text-white truncate">
                        {name || "Your Agency Name"}
                      </p>
                      {licenseNumber && (
                        <span className="text-[9px] text-gray-500 dark:text-gray-400 font-mono block truncate">
                          {licenseNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Interactive Component Buttons */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-gray-400">Branded Action Buttons:</span>
                <div className="flex flex-wrap items-center gap-2">
                  <button 
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-white shadow-xs transition-opacity hover:opacity-90"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Primary Action
                  </button>
                  <button 
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-white shadow-xs transition-opacity hover:opacity-90"
                    style={{ backgroundColor: secondaryColor }}
                  >
                    Secondary Action
                  </button>
                  <span 
                    className="rounded-full px-2 py-0.5 text-[11px] font-medium border"
                    style={{ 
                      color: primaryColor, 
                      backgroundColor: `${primaryColor}15`,
                      borderColor: `${primaryColor}30`
                    }}
                  >
                    Status Badge
                  </span>
                </div>
              </div>

              {/* 3. Candidate / Employer Portal Mockup */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium text-gray-400">Candidate Portal Header:</span>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-strokedark dark:bg-boxdark-2 text-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-5 w-5 rounded bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center text-brand-600 font-bold text-[10px]">
                      {name?.charAt(0) || "A"}
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white text-xs">
                      {name || "Agency Recruitment Portal"}
                    </span>
                  </div>
                  {tagline && (
                    <p className="text-[10px] text-gray-500 italic mb-2">
                      "{tagline}"
                    </p>
                  )}
                  <div className="bg-white dark:bg-boxdark p-2 rounded border border-gray-200 dark:border-strokedark flex items-center justify-between">
                    <span className="text-[11px] text-gray-600 dark:text-gray-300">Visa Status:</span>
                    <span className="text-[10px] font-semibold text-green-600 bg-green-50 dark:bg-green-950/40 px-1.5 py-0.5 rounded">
                      Approved
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Portal Footer Mockup */}
              <div className="space-y-1.5 pt-2 border-t border-gray-100 dark:border-strokedark/60">
                <span className="text-[11px] font-medium text-gray-400">Portal Footer:</span>
                <div className="p-2.5 rounded bg-gray-50 dark:bg-meta-4 text-[10px] text-center text-gray-500 dark:text-gray-400 space-y-1">
                  <p>© {new Date().getFullYear()} {name || "Your Agency"}. All rights reserved.</p>
                  {address && <p className="text-[9px] text-gray-400">{address}</p>}
                  {!hidePoweredBy && (
                    <p className="text-[9px] text-gray-400 pt-1 border-t border-gray-200/60 dark:border-strokedark/60">
                      Powered by <strong className="text-brand-500">DeployX</strong>
                    </p>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}

