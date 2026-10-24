
import { useRef, useState } from "react";
import { CloudUpload, X, ImagePlus } from "lucide-react";

const ProductImageUpload = () => {
  const inputRef = useRef(null);
  const [images, setImages] = useState([]);

  const handleImages = (e) => {
    const files = Array.from(e.target.files || []);
    const newImages = files
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        id: crypto.randomUUID(),
      }));

    setImages((prev) => [...prev, ...newImages]);
    e.target.value = "";
  };

  const removeImage = (id) => {
    setImages((prev) => {
      const imageToRemove = prev.find((image) => image.id === id);
      if (imageToRemove) URL.revokeObjectURL(imageToRemove.preview);
      return prev.filter((image) => image.id !== id);
    });
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        Product Images <span className="text-destructive">*</span>
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        hidden
        onChange={handleImages}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex min-h-40 w-full flex-col items-center justify-center
          rounded-lg border-2 border-dashed border-emerald-700/25
          bg-emerald-50/30 p-6 text-center transition
          hover:border-emerald-700 hover:bg-emerald-50"
      >
        <CloudUpload className="mb-3 size-9 text-emerald-700" />

        <span className="text-sm font-medium text-slate-700">
          Drag images here or{" "}
          <span className="text-emerald-700 underline">
            browse files
          </span>
        </span>

        <span className="mt-2 text-xs text-slate-500">
          PNG, JPG or WEBP (max 5MB per image)
        </span>
      </button>

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative overflow-hidden rounded-lg border"
            >
              <img
                src={image.preview}
                alt={image.file.name}
                className="h-28 w-full object-cover"
              />

              <button
                type="button"
                onClick={() => removeImage(image.id)}
                aria-label={`Remove ${image.file.name}`}
                className="absolute right-1 top-1 rounded-full
                  bg-white p-1 text-red-600 shadow hover:bg-red-50"
              >
                <X className="size-4" />
              </button>

              <p className="truncate px-2 py-1 text-xs text-slate-600">
                {image.file.name}
              </p>
            </div>
          ))}

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex min-h-28 flex-col items-center justify-center
              rounded-lg border-2 border-dashed text-sm text-slate-500
              hover:border-emerald-700 hover:text-emerald-700"
          >
            <ImagePlus className="mb-1 size-6" />
            Add more
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;
