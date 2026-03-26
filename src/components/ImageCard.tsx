"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { deleteImage } from "@/app/actions";
import { toast } from "react-hot-toast";

interface ImageCardProps {
  id: string;
  url: string;
  title: string;
  description?: string | null;
  createdAt: Date;
  onDelete?: () => void;
}

export default function ImageCard({
  id,
  url,
  title,
  description,
  createdAt,
  onDelete,
}: ImageCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this image?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteImage(id);
      toast.success("Image deleted successfully!");
      onDelete?.();
    } catch (error) {
      toast.error("Failed to delete image");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Container */}
      <Link href={`/image/${id}`} className="block relative w-full h-64 overflow-hidden bg-gray-100">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="text-center">
              <p className="text-gray-500 text-sm">Failed to load image</p>
              <p className="text-gray-400 text-xs mt-1">{url}</p>
            </div>
          </div>
        ) : (
          <Image
            src={url}
            alt={title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/image/${id}`}>
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors">
            {title}
          </h3>
        </Link>

        {description && (
          <p className="text-gray-600 text-sm mt-2 line-clamp-2">{description}</p>
        )}

        <p className="text-gray-400 text-xs mt-3">{formattedDate}</p>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Link
            href={`/edit/${id}`}
            className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors text-center"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 px-3 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
