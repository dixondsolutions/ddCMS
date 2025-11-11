import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthKitProvider } from "@workos-inc/authkit-react";
import { ConvexProvider } from "./lib/convex";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/dashboard/Dashboard";
import SiteList from "./admin/sites/SiteList";
import PageEditor from "./admin/pages/PageEditor";
import MediaLibrary from "./admin/media/MediaLibrary";
import TenantSettings from "./admin/settings/TenantSettings";
import TemplateSelector from "./admin/templates/TemplateSelector";
import BuilderCanvas from "./builder/canvas/BuilderCanvas";
import PreviewPage from "./preview/PreviewPage";
import PublicSite from "./public/PublicSite";

const authkitClientId = import.meta.env.VITE_WORKOS_CLIENT_ID;
if (!authkitClientId) {
  console.warn("Missing VITE_WORKOS_CLIENT_ID environment variable");
}

function App() {
  return (
    <AuthKitProvider
      clientId={authkitClientId || ""}
      redirectUri={window.location.origin}
    >
      <ConvexProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
            <Route path="sites" element={<SiteList />} />
            <Route path="sites/:siteId/pages" element={<PageEditor />} />
            <Route path="sites/:siteId/pages/:pageId/edit" element={<BuilderCanvas />} />
            <Route path="sites/:siteId/pages/:pageId/preview" element={<PreviewPage />} />
            <Route path="media" element={<MediaLibrary />} />
              <Route path="settings" element={<TenantSettings />} />
              <Route path="templates" element={<TemplateSelector />} />
            </Route>
            <Route path="/*" element={<PublicSite />} />
          </Routes>
        </BrowserRouter>
      </ConvexProvider>
    </AuthKitProvider>
  );
}

export default App;
