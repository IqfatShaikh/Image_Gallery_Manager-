import ImageForm from "@/components/ImageForm";
import { getImage } from "@/app/actions";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Image - Image Gallery",
  description: "Edit an image in your gallery",
};

interface EditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditPage({ params }: EditPageProps) {
  const { id } = await params;

  let image;
  try {
    image = await getImage(id);
  } catch (error) {
    console.error(error);
  }

  if (!image) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Edit Image</h1>
          <p className="text-gray-600">Update image details</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <ImageForm
            isEdit={true}
            initialData={{
              id: image.id,
              url: image.url,
              title: image.title,
              description: image.description,
            }}
          />
        </div>
      </div>
    </div>
  );
}
