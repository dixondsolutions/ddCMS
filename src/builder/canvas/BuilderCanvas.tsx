import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/api";
import TemplateRenderer from "../../shared/components/TemplateRenderer";
import ComponentPalette from "../sidebar/ComponentPalette";
import PropertyPanel from "../sidebar/PropertyPanel";
import { Save, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BuilderCanvas() {
  const { siteId, pageId } = useParams<{ siteId: string; pageId: string }>();
  const navigate = useNavigate();
  const site = useQuery(
    api.queries.sites.getById,
    siteId ? { id: siteId as Id<"sites"> } : "skip"
  );
  const page = useQuery(
    api.queries.pages.getById,
    pageId ? { id: pageId as Id<"pages"> } : "skip"
  );
  const template = useQuery(
    api.queries.templates.getById,
    site?.templateId ? { id: site.templateId } : "skip"
  );
  const updatePage = useMutation(api.mutations.pages.update);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [templateData, setTemplateData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!siteId || !pageId) {
    return <div>Site ID and Page ID required</div>;
  }

  if (site === undefined || page === undefined || template === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
        <p className="text-gray-500">No template found for this site.</p>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updatePage({
        id: page._id,
        templateData: templateData || page.templateData || template.schema,
      });
    } catch (error) {
      console.error("Failed to save page:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    // Navigate to preview mode
    navigate(`/admin/sites/${siteId}/pages/${pageId}/preview`);
  };

  const pageSchema = page.templateData || template.schema;
  const currentData = templateData || {};

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Component Palette */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <ComponentPalette
          onSelectComponent={(component) => {
            // Add component to template data
            const newData = { ...currentData };
            const componentId = `component-${Date.now()}`;
            newData[componentId] = component;
            setTemplateData(newData);
          }}
        />
      </div>

      {/* Canvas */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {page.title}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreview}
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
            <TemplateRenderer schema={pageSchema} data={currentData} />
          </div>
        </div>
      </div>

      {/* Property Panel */}
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <PropertyPanel
          selectedComponent={selectedComponent}
          onUpdate={(updates) => {
            if (selectedComponent) {
              const newData = { ...currentData };
              newData[selectedComponent] = {
                ...newData[selectedComponent],
                ...updates,
              };
              setTemplateData(newData);
            }
          }}
        />
      </div>
    </div>
  );
}
