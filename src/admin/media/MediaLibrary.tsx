import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useDropzone } from "react-dropzone";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/api";
import { Upload, Image as ImageIcon, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

export default function MediaLibrary() {
  const media = useQuery(api.queries.media.listForTenant);
  const generateUploadUrl = useMutation(api.actions.fileUpload.generateUploadUrl);
  const uploadMedia = useMutation(api.mutations.media.upload);
  const deleteMedia = useMutation(api.mutations.media.remove);
  const [uploading, setUploading] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    setUploading(true);
    try {
      for (const file of acceptedFiles) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });
        const { storageId } = await result.json();

        await uploadMedia({
          storageId,
          filename: file.name,
          mimeType: file.type,
          size: file.size,
        });
      }
      toast.success(`Successfully uploaded ${acceptedFiles.length} file(s)`);
    } catch (error) {
      console.error("Failed to upload file:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
    },
  });

  const handleDelete = async (mediaId: Id<"media">) => {
    if (confirm("Are you sure you want to delete this file?")) {
      try {
        await deleteMedia({ id: mediaId });
        toast.success("File deleted successfully!");
      } catch (error) {
        console.error("Failed to delete file:", error);
        toast.error("Failed to delete file. Please try again.");
      }
    }
  };

  if (media === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
        <p className="mt-2 text-gray-600">Upload and manage your media files</p>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        {isDragActive ? (
          <p className="text-lg text-gray-600">Drop files here...</p>
        ) : (
          <>
            <p className="text-lg text-gray-600 mb-2">
              Drag and drop files here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              Supports: PNG, JPG, JPEG, GIF, WEBP
            </p>
          </>
        )}
      </div>

      {uploading && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-blue-700">Uploading files...</p>
        </div>
      )}

      {media.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Uploaded Files
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {media.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow border border-gray-200 p-4 hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square bg-gray-100 rounded mb-2 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600 truncate mb-2">
                  {item.filename}
                </p>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="w-full px-2 py-1 text-xs text-red-700 bg-red-50 rounded hover:bg-red-100 flex items-center justify-center"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

