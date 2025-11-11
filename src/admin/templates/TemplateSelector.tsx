import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { defaultTemplates } from "../../shared/types/template";
import { useNavigate } from "react-router-dom";
import { Palette, Check } from "lucide-react";
import { useState } from "react";

export default function TemplateSelector() {
  const navigate = useNavigate();
  const templates = useQuery(api.queries.templates.listPublic);
  const createSite = useMutation(api.mutations.sites.create);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSelectTemplate = async (templateId: string) => {
    if (isCreating) return;
    
    setIsCreating(true);
    try {
      // Create site with selected template
      const siteId = await createSite({
        name: "New Site",
        slug: `site-${Date.now()}`,
        templateId: templateId as any,
      });
      navigate(`/admin/sites/${siteId}/pages`);
    } catch (error) {
      console.error("Failed to create site:", error);
    } finally {
      setIsCreating(false);
    }
  };

  // For now, show default templates until we have templates in the database
  const availableTemplates = templates && templates.length > 0 
    ? templates 
    : defaultTemplates.map((t, i) => ({
        _id: `default-${i}` as any,
        name: t.metadata?.name || "Template",
        category: t.metadata?.category || "General",
        schema: t,
        isPublic: true,
        createdAt: Date.now(),
        createdBy: "" as any,
        previewImage: undefined,
      }));

  if (availableTemplates === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
        <p className="mt-2 text-gray-600">
          Choose a template to start building your website
        </p>
      </div>

      {availableTemplates.length === 0 ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
          <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No templates available
          </h3>
          <p className="text-gray-500">
            Templates will be created in Phase 3 of the implementation
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {availableTemplates.map((template) => {
            const isSelected = selectedTemplate === template._id;
            return (
              <div
                key={template._id}
                onClick={() => !isCreating && setSelectedTemplate(template._id)}
                className={`bg-white rounded-lg shadow border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-blue-500 shadow-lg"
                    : "border-gray-200 hover:shadow-lg"
                } ${isCreating ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                  <Palette className="h-16 w-16 text-gray-400" />
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-2">
                      <Check className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {template.name}
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">
                      {template.category}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTemplate(template._id);
                    }}
                    disabled={isCreating}
                    className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? "Creating..." : "Use Template"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
