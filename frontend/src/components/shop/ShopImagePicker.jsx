import { useRef, useState } from "react";
import {
  UploadCloud,
  Link as LinkIcon,
  X,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function ShopImagePicker({
  label,
  helpText,
  aspectRatio = "square", // "square" | "banner"
  mode, // "upload" | "url"
  onModeChange,
  file,
  onFileChange,
  urlValue,
  onUrlChange,
  preview,
  onClear,
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.add({
        type: "error",
        description: "Please select an image file (PNG, JPG, WebP)",
      });
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.add({
        type: "error",
        description: "Image size must not exceed 5MB",
      });
      return;
    }

    onFileChange(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const isSquare = aspectRatio === "square";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700">
          {label}
        </label>

        {/* Mode Selector Pill Buttons */}
        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
          <button
            type="button"
            onClick={() => onModeChange("upload")}
            className={`inline-flex items-center gap-1.5 h-8 px-3.5 rounded-md font-medium transition cursor-pointer ${
              mode === "upload"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <UploadCloud size={14} />
            <span>Upload File</span>
          </button>
          <button
            type="button"
            onClick={() => onModeChange("url")}
            className={`inline-flex items-center gap-1.5 h-8 px-3.5 rounded-md font-medium transition cursor-pointer ${
              mode === "url"
                ? "bg-white text-emerald-800 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <LinkIcon size={14} />
            <span>Image URL</span>
          </button>
        </div>
      </div>

      {mode === "upload" ? (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/jpg"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileSelect(e.target.files[0]);
              }
              e.target.value = "";
            }}
          />

          {file || preview ? (
            <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
              <div
                className={`overflow-hidden rounded-md border border-slate-200 bg-white shrink-0 ${
                  isSquare ? "size-14" : "h-14 w-28"
                }`}
              >
                <img
                  src={preview}
                  alt={label}
                  className="size-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {file ? file.name : "Custom Image"}
                </p>
                {file && (
                  <p className="text-[11px] text-slate-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-medium text-emerald-700 hover:underline cursor-pointer"
                  >
                    Change
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={onClear}
                    className="text-xs font-medium text-red-500 hover:underline cursor-pointer inline-flex items-center gap-0.5"
                  >
                    <X size={12} /> Remove
                  </button>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                <Check size={12} /> Ready
              </span>
            </div>
          ) : (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center p-5 rounded-lg border-2 border-dashed transition cursor-pointer text-center ${
                isDragging
                  ? "border-emerald-600 bg-emerald-50/60"
                  : "border-slate-200 bg-slate-50/50 hover:border-emerald-600 hover:bg-emerald-50/30"
              }`}
            >
              <UploadCloud
                size={24}
                className={isDragging ? "text-emerald-700" : "text-slate-400"}
              />
              <p className="mt-1 text-xs font-medium text-slate-700">
                <span className="text-emerald-700 font-semibold underline">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                PNG, JPG or WebP (max 5MB) • {helpText}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <LinkIcon
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              value={urlValue}
              onChange={(e) => onUrlChange(e.target.value)}
              placeholder={`https://example.com/${isSquare ? "logo.png" : "banner.jpg"}`}
              className="pl-9 pr-8"
            />
            {urlValue && (
              <button
                type="button"
                onClick={onClear}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-400">{helpText}</p>
        </div>
      )}
    </div>
  );
}
