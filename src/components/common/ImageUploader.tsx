import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, Image as ImageIcon, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";
import api from "../../api/axios";

interface ImageUploaderProps {
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: any) => void;
  className?: string;
  defaultImage?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onUploadSuccess,
  onUploadError,
  className = "",
  defaultImage,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(defaultImage || null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Create local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setIsUploading(true);

    try {
      // 1. Compress the image before uploading
      const options = {
        maxSizeMB: 1, // Max file size in MB
        maxWidthOrHeight: 1920, // Max width/height
        useWebWorker: true,
        fileType: "image/webp", // Convert to WebP for best optimization
      };
      
      const compressedFile = await imageCompression(file, options);
      
      const formData = new FormData();
      formData.append("file", compressedFile, compressedFile.name);

      // 2. Send compressed file to backend /upload route
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        const url = response.data.data.url;
        setPreview(url);
        toast.success("Image uploaded successfully");
        if (onUploadSuccess) onUploadSuccess(url);
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to upload image");
      setPreview(defaultImage || null); // Revert to default on error
      if (onUploadError) onUploadError(error);
    } finally {
      setIsUploading(false);
    }
  }, [defaultImage, onUploadSuccess, onUploadError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
    },
    maxFiles: 1,
    multiple: false,
    disabled: isUploading,
  });

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    if (onUploadSuccess) onUploadSuccess(""); // Send empty string back
  };

  return (
    <div className={`relative ${className}`}>
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-200 overflow-hidden ${
          isDragActive
            ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
            : "border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-750"
        } ${isUploading ? "opacity-75 pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="relative w-full h-full group">
            <img
              src={preview}
              alt="Preview"
              className="object-cover w-full h-full"
            />
            {/* Overlay for re-uploading / removing */}
            {!isUploading && (
              <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={clearImage}
                  className="p-2 text-white bg-red-500 rounded-full hover:bg-red-600"
                  title="Remove image"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="p-2 text-white bg-white/20 rounded-full backdrop-blur-sm">
                  <UploadCloud className="w-5 h-5" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <div className="p-3 mb-3 rounded-full bg-brand-100 text-brand-500 dark:bg-brand-500/20 dark:text-brand-400">
              <ImageIcon className="w-6 h-6" />
            </div>
            <p className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Click to upload <span className="font-normal text-gray-500">or drag and drop</span>
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or WEBP (max. 10MB)
            </p>
          </div>
        )}

        {/* Uploading Overlay */}
        {isUploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin mb-2" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploading...</span>
          </div>
        )}
      </div>
    </div>
  );
};
