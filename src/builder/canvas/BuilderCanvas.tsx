import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/api";
import TemplateRenderer from "../../shared/components/TemplateRenderer";
import ComponentPalette from "../sidebar/ComponentPalette";
import PropertyPanel from "../sidebar/PropertyPanel";
import { Save, Eye, Undo2, Redo2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBuilderStore } from "../BuilderStore";
import toast from "react-hot-toast";

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
  const [isSaving, setIsSaving] = useState(false);

  // Use BuilderStore
  const {
    templateData,
    selectedComponentId,
    setTemplateData,
    selectComponent,
    addComponent,
    updateComponent,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
  } = useBuilderStore();

  // Initialize template data when page loads
  useEffect(() => {
    if (page && template) {
      const pageSchema = page.templateData || template.schema;
      setTemplateData(pageSchema);
    }
    return () => {
      reset(); // Clean up on unmount
    };
  }, [page, template, setTemplateData, reset]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

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
    if (!page || !templateData) return;

    setIsSaving(true);
    try {
      await updatePage({
        id: page._id,
        templateData,
      });
      toast.success("Page saved successfully!");
    } catch (error) {
      console.error("Failed to save page:", error);
      toast.error("Failed to save page. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    // Navigate to preview mode
    navigate(`/admin/sites/${siteId}/pages/${pageId}/preview`);
  };

  if (!templateData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Component Palette */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <ComponentPalette
          onSelectComponent={(component) => {
            addComponent(component);
            toast.success("Component added");
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
            {/* Undo/Redo buttons */}
            <button
              onClick={undo}
              disabled={!canUndo()}
              className="flex items-center px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="h-4 w-4" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo()}
              className="flex items-center px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="h-4 w-4" />
            </button>
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
            <TemplateRenderer schema={templateData} data={{}} />
          </div>
        </div>
      </div>

      {/* Property Panel */}
      <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
        <PropertyPanel
          selectedComponent={selectedComponentId}
          templateData={templateData}
          onUpdate={(updates) => {
            if (selectedComponentId) {
              updateComponent(selectedComponentId, updates);
            }
          }}
        />
      </div>
    </div>
  );
}
