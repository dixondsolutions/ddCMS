import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useParams } from "react-router-dom";
import TemplateRenderer from "../shared/components/TemplateRenderer";

export default function PublicSite() {
  const params = useParams();
  const path = params["*"] || "/";

  // In a real implementation, this would:
  // 1. Detect the domain/host from window.location
  // 2. Find the tenant by domain
  // 3. Find the site for that tenant
  // 4. Find the page by path
  // 5. Render the page with the template

  // For now, we'll use a simple implementation
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  
  // Try to get tenant by domain
  const tenant = useQuery(
    api.queries.tenants.getByDomain,
    host ? { domain: host } : "skip"
  );

  // Get sites for tenant
  const sites = useQuery(
    api.queries.sites.listForTenant,
    tenant ? {} : "skip"
  );

  // Get published site
  const site = sites?.find((s) => s.status === "published");

  // Get page by path
  const page = useQuery(
    api.queries.pages.getByPath,
    site ? { siteId: site._id, path } : "skip"
  );

  // Get template
  const template = useQuery(
    api.queries.templates.getById,
    site?.templateId ? { id: site.templateId } : "skip"
  );

  if (tenant === undefined || sites === undefined || page === undefined || template === undefined) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!tenant || !site || !page || !template) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Site Not Found</h1>
          <p className="text-gray-600">The requested page could not be found.</p>
        </div>
      </div>
    );
  }

  const pageSchema = page.templateData || template.schema;

  return (
    <div className="min-h-screen bg-white">
      <TemplateRenderer schema={pageSchema} data={page.templateData || {}} />
    </div>
  );
}
