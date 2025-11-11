import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/api";
import { FileText, Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function PageEditor() {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const site = useQuery(
    api.queries.sites.getById,
    siteId ? { id: siteId as Id<"sites"> } : "skip"
  );
  const pages = useQuery(
    api.queries.pages.listForSite,
    siteId ? { siteId: siteId as Id<"sites"> } : "skip"
  );
  const createPage = useMutation(api.mutations.pages.create);

  if (!siteId) {
    return <div>Site ID required</div>;
  }

  if (site === undefined || pages === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const handleCreatePage = async () => {
    try {
      const pageId = await createPage({
        siteId: siteId as Id<"sites">,
        title: "New Page",
        slug: `page-${Date.now()}`,
        path: `/page-${Date.now()}`,
        templateData: {},
      });
      toast.success("Page created successfully!");
      navigate(`/admin/sites/${siteId}/pages/${pageId}/edit`);
    } catch (error) {
      console.error("Failed to create page:", error);
      toast.error("Failed to create page. Please try again.");
    }
  };

  // If no pages exist, show create page option
  if (pages.length === 0) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{site.name}</h1>
          <p className="mt-2 text-gray-600">Manage pages for this site</p>
        </div>
        <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No pages yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first page to start building
          </p>
          <button
            onClick={handleCreatePage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center mx-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Page
          </button>
        </div>
      </div>
    );
  }

  // Show page list
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{site.name}</h1>
          <p className="mt-2 text-gray-600">Manage pages for this site</p>
        </div>
        <button
          onClick={handleCreatePage}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Page
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Pages</h2>
        </div>
        <ul className="divide-y divide-gray-200">
          {pages.map((page) => (
            <li key={page._id} className="p-4 hover:bg-gray-50">
              <Link
                to={`/admin/sites/${siteId}/pages/${page._id}/edit`}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-gray-900">{page.title}</p>
                  <p className="text-sm text-gray-500">{page.path}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    page.publishedAt
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {page.publishedAt ? "Published" : "Draft"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
