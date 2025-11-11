import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useNavigate } from "react-router-dom";
import { Plus, Globe, Edit, Trash2 } from "lucide-react";

export default function SiteList() {
  const navigate = useNavigate();
  const sites = useQuery(api.queries.sites.listForTenant);
  const createSite = useMutation(api.mutations.sites.create);
  const deleteSite = useMutation(api.mutations.sites.remove);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateSite = async () => {
    setIsCreating(true);
    // For now, we'll need a template ID - this will be handled by template selector
    // In a real implementation, you'd navigate to template selector first
    try {
      const siteId = await createSite({
        name: "New Site",
        slug: `site-${Date.now()}`,
        templateId: "" as any, // Placeholder - will be fixed when templates are created
      });
      navigate(`/admin/sites/${siteId}/pages`);
    } catch (error) {
      console.error("Failed to create site:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteSite = async (siteId: string) => {
    if (confirm("Are you sure you want to delete this site?")) {
      try {
        await deleteSite({ id: siteId as any });
      } catch (error) {
        console.error("Failed to delete site:", error);
      }
    }
  };

  if (sites === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sites</h1>
          <p className="mt-2 text-gray-600">
            Manage your websites and pages
          </p>
        </div>
        <button
          onClick={handleCreateSite}
          disabled={isCreating}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Plus className="h-5 w-5 mr-2" />
          {isCreating ? "Creating..." : "New Site"}
        </button>
      </div>

      {sites.length === 0 ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
          <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No sites yet
          </h3>
          <p className="text-gray-500 mb-6">
            Get started by creating your first website
          </p>
          <button
            onClick={handleCreateSite}
            disabled={isCreating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Site
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => (
            <div
              key={site._id}
              className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <Globe className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {site.name}
                    </h3>
                    <p className="text-sm text-gray-500">{site.slug}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    site.status === "published"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {site.status}
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <button
                  onClick={() => navigate(`/admin/sites/${site._id}/pages`)}
                  className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSite(site._id)}
                  className="px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

