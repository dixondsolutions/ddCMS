import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useParams } from "react-router-dom";
import TemplateRenderer from "../../shared/components/TemplateRenderer";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function PreviewPage() {
  const { siteId, pageId } = useParams<{ siteId: string; pageId: string }>();
  
  const site = useQuery(
    api.queries.sites.getById,
    siteId ? { id: siteId as any } : "skip"
  );
  const page = useQuery(
    api.queries.pages.getById,
    pageId ? { id: pageId as any } : "skip"
  );
  const template = useQuery(
    api.queries.templates.getById,
    site?.templateId ? { id: site.templateId } : "skip"
  );

  if (site === undefined || page === undefined || template === undefined) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!site || !page || !template) {
    return <div>Page not found</div>;
  }

  const pageSchema = page.templateData || template.schema;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center">
        <Link
          to={`/admin/sites/${siteId}/pages/${pageId}/edit`}
          className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Editor
        </Link>
        <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
      </div>
      <div className="p-8">
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <TemplateRenderer schema={pageSchema} data={page.templateData || {}} />
        </div>
      </div>
    </div>
  );
}

