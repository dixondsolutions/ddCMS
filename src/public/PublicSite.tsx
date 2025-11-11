import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import TemplateRenderer from "../shared/components/TemplateRenderer";

export default function PublicSite() {
  const params = useParams();
  const path = params["*"] || "/";

  // Detect the domain/host from window.location
  const host = typeof window !== "undefined" ? window.location.hostname : "";

  // For local development, check if using localhost
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");

  // Try to get tenant by custom domain (skip for localhost)
  const tenant = useQuery(
    api.queries.tenants.getByDomain,
    !isLocalhost && host ? { domain: host } : "skip"
  );

  // Get sites for tenant
  const sites = useQuery(
    api.queries.sites.listForTenant,
    tenant ? {} : "skip"
  );

  // Get the first published site
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

  // Loading state
  if (
    (!isLocalhost && tenant === undefined) ||
    sites === undefined ||
    page === undefined ||
    template === undefined
  ) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Handle localhost development mode
  if (isLocalhost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-2xl bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Public Site Preview
          </h1>
          <p className="text-gray-600 mb-6">
            The public site feature requires a custom domain to be configured.
            For local development, you can test this by:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6">
            <li>Configure a custom domain for your site in the admin panel</li>
            <li>Add an entry to your /etc/hosts file pointing the domain to 127.0.0.1</li>
            <li>Access the site using that custom domain</li>
          </ol>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> In production, custom domains will automatically
              route to the correct tenant and display their published site.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!tenant || !site || !page || !template) {
    return (
      <>
        <Helmet>
          <title>Site Not Found</title>
        </Helmet>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Site Not Found
            </h1>
            <p className="text-gray-600">
              The requested page could not be found.
            </p>
          </div>
        </div>
      </>
    );
  }

  const pageSchema = page.templateData || template.schema;

  // Extract SEO meta from site settings
  const seoMeta = {
    title: site.settings.seo?.title || site.name,
    description: site.settings.seo?.description || "",
    keywords: site.settings.seo?.keywords || [],
  };

  return (
    <>
      <Helmet>
        <title>{seoMeta.title}</title>
        {seoMeta.description && (
          <meta name="description" content={seoMeta.description} />
        )}
        {seoMeta.keywords.length > 0 && (
          <meta name="keywords" content={seoMeta.keywords.join(", ")} />
        )}
        <meta property="og:title" content={seoMeta.title} />
        {seoMeta.description && (
          <meta property="og:description" content={seoMeta.description} />
        )}
        {site.settings.analytics?.googleAnalyticsId && (
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${site.settings.analytics.googleAnalyticsId}`}
          />
        )}
      </Helmet>
      <div className="min-h-screen bg-white">
        <TemplateRenderer schema={pageSchema} data={page.templateData || {}} />
      </div>
    </>
  );
}
