import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@workos-inc/authkit-react";
import { SignInButton, UserButton } from "@workos-inc/authkit-react";
import {
  LayoutDashboard,
  Globe,
  FileText,
  Image,
  Settings,
  Palette,
} from "lucide-react";

export default function AdminLayout() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
          <SignInButton />
        </div>
      </div>
    );
  }

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Sites", href: "/admin/sites", icon: Globe },
    { name: "Pages", href: "/admin/sites", icon: FileText },
    { name: "Media", href: "/admin/media", icon: Image },
    { name: "Templates", href: "/admin/templates", icon: Palette },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <h1 className="text-xl font-bold text-gray-900">CMS Builder</h1>
          </div>
          <nav className="mt-6">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-6 py-3 text-sm font-medium ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {navigation.find((n) => n.href === location.pathname)?.name ||
                  "Admin"}
              </h2>
              <UserButton />
            </div>
          </header>

          {/* Page content */}
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

