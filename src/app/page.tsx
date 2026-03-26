"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ImageCard from "@/components/ImageCard";
import { getAllImages } from "./actions";
import { toast } from "react-hot-toast";

interface Image {
  id: string;
  url: string;
  title: string;
  description: string | null;
  createdAt: Date;
}

export default function Home() {
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch images
  useEffect(() => {
    const fetchImages = async () => {
      setIsLoading(true);
      try {
        const data = await getAllImages(debouncedSearch, sortBy);
        setImages(data);
      } catch (error) {
        toast.error("Failed to load images");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [debouncedSearch, sortBy]);

  const handleDeleteSuccess = () => {
    setImages(images.filter((img) => img.id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Image Gallery</h1>
          <p className="text-gray-600">Manage your image collection with ease</p>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <Link
            href="/add"
            className="inline-block px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
          >
            + Add New Image
          </Link>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Images
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin text-4xl mb-4">🔄</div>
              <p className="text-gray-600">Loading images...</p>
            </div>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📸</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No images found</h2>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? "Try adjusting your search query"
                : "Start by adding your first image"}
            </p>
            <Link
              href="/add"
              className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add Image
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              Found {images.length} image{images.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <ImageCard
                  key={image.id}
                  {...image}
                  onDelete={() => {
                    setImages(images.filter((img) => img.id !== image.id));
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
