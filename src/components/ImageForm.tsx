"use client";

import { useState, FormEvent } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createImage, updateImage } from "@/app/actions";

interface ImageFormProps {
  initialData?: {
    id: string;
    url: string;
    title: string;
    description: string | null;
  };
  isEdit?: boolean;
}

export default function ImageForm({ initialData, isEdit = false }: ImageFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    url: initialData?.url || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
  });
  const [urlError, setUrlError] = useState("");

  const isValidUrl = (urlString: string): boolean => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "url" && value && !isValidUrl(value)) {
      setUrlError("Please enter a valid URL");
    } else {
      setUrlError("");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.url.trim()) {
      setUrlError("URL is required");
      return;
    }

    if (!isValidUrl(formData.url)) {
      setUrlError("Please enter a valid URL");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsLoading(true);

    try {
      if (isEdit && initialData) {
        await updateImage(initialData.id, {
          url: formData.url,
          title: formData.title,
          description: formData.description,
        });
        toast.success("Image updated successfully!");
      } else {
        await createImage({
          url: formData.url,
          title: formData.title,
          description: formData.description,
        });
        toast.success("Image added successfully!");
        setFormData({ url: "", title: "", description: "" });
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(isEdit ? "Failed to update image" : "Failed to add image");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* URL Input */}
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
          Image URL *
        </label>
        <input
          type="text"
          id="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {urlError && <p className="text-red-500 text-sm mt-1">{urlError}</p>}
      </div>

      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Image title"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Description Input */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Image description (optional)"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Preview */}
      {formData.url && !urlError && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-3">Preview:</p>
          <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
            <img
              src={formData.url}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => {
                setUrlError("Failed to load image preview");
              }}
            />
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin mr-2">⏳</span>
              {isEdit ? "Updating..." : "Adding..."}
            </span>
          ) : isEdit ? (
            "Update Image"
          ) : (
            "Add Image"
          )}
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
