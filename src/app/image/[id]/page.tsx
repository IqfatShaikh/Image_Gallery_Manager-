"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getImage } from "@/app/actions";
import { useParams, useRouter } from "next/navigation";

interface ImageData {
  id: string;
  url: string;
  title: string;
  description: string | null;
  createdAt: Date;
}

export default function ImageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [image, setImage] = useState<ImageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const data = await getImage(id);
        setImage(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">🔄</div>
          <p className="text-gray-600">Loading image...</p>
        </div>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Image not found</h1>
          <p className="text-gray-600 mb-6">The image you're looking for doesn't exist.</p>
          <Link
            href="/"
            className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(image.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-block px-4 py-2 mb-8 bg-white text-blue-500 rounded-lg hover:bg-gray-100 transition-colors shadow-md"
        >
          ← Back to Gallery
        </Link>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Image Container */}
          <div className="relative w-full bg-gray-100">
            {imageError ? (
              <div className="w-full h-96 flex items-center justify-center bg-gray-200">
                <div className="text-center">
                  <p className="text-gray-500 text-lg mb-2">Failed to load image</p>
                  <p className="text-gray-400 text-sm break-all max-w-lg">{image.url}</p>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-96 md:h-[500px]">
                <Image
                  src={image.url}
                  alt={image.title}
                  fill
                  className="object-cover"
                  onError={() => setImageError(true)}
                  priority
                />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{image.title}</h1>

            {image.description && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-gray-700 mb-2">Description</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {image.description}
                </p>
              </div>
            )}

            {/* Metadata */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Date Added</p>
                  <p className="text-gray-800 font-medium">{formattedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Image URL</p>
                  <a
                    href={image.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 truncate block"
                  >
                    {image.url}
                  </a>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8">
              <Link
                href={`/edit/${image.id}`}
                className="flex-1 px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors text-center"
              >
                Edit Image
              </Link>
              <Link
                href="/"
                className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 font-medium rounded-lg hover:bg-gray-400 transition-colors text-center"
              >
                Back to Gallery
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
