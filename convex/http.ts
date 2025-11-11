import { httpRouter } from "convex/server";
import { httpAction } from "../_generated/server";

const http = httpRouter();

// Custom domain routing
http.route({
  path: "/",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const host = request.headers.get("host");
    if (!host) {
      return new Response("Host header required", { status: 400 });
    }

    // Get tenant by custom domain
    const tenant = await ctx.runQuery("queries/tenants:getByDomain", {
      domain: host,
    });

    if (!tenant) {
      return new Response("Site not found", { status: 404 });
    }

    // Get the default site for this tenant (or implement site selection logic)
    const sites = await ctx.runQuery("queries/sites:listForTenant", {});
    const site = sites.find((s) => s.status === "published");

    if (!site) {
      return new Response("No published site found", { status: 404 });
    }

    // Get the home page
    const page = await ctx.runQuery("queries/pages:getByPath", {
      siteId: site._id,
      path: "/",
    });

    if (!page) {
      return new Response("Page not found", { status: 404 });
    }

    // Return HTML (in production, this would render the React app)
    return new Response(
      JSON.stringify({ tenant, site, page }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }),
});

export default http;

