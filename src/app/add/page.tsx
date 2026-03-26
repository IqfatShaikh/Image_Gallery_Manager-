import ImageForm from "@/components/ImageForm";

export const metadata = {
  title: "Add Image - Image Gallery",
  description: "Add a new image to your gallery",
};

export default function AddPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Add New Image</h1>
          <p className="text-gray-600">Add a new image to your gallery</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <ImageForm />
        </div>
      </div>
    </div>
  );
}
