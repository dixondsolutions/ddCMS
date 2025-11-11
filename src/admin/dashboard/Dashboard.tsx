import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Globe, FileText, Image } from "lucide-react";

export default function Dashboard() {
  const tenant = useQuery(api.queries.tenants.getCurrentTenant);
  const sites = useQuery(api.queries.sites.listForTenant);

  if (tenant === undefined || sites === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const stats = [
    {
      name: "Sites",
      value: sites?.length || 0,
      icon: Globe,
      color: "bg-blue-500",
    },
    {
      name: "Pages",
      value: sites?.reduce((acc, site) => acc + (site.pagesCount || 0), 0) || 0,
      icon: FileText,
      color: "bg-green-500",
    },
    {
      name: "Media Files",
      value: 0, // Will be calculated when media query is added
      icon: Image,
      color: "bg-purple-500",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {tenant?.name || "User"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <div className={`${stat.color} rounded-lg p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  {stat.name}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recent Sites
        </h2>
        {sites && sites.length > 0 ? (
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <ul className="divide-y divide-gray-200">
              {sites.slice(0, 5).map((site) => (
                <li key={site._id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {site.name}
                      </p>
                      <p className="text-sm text-gray-500">{site.slug}</p>
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
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No sites yet. Create your first site!</p>
          </div>
        )}
      </div>
    </div>
  );
}

