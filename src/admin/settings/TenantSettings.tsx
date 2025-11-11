import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Save, Upload } from "lucide-react";
import { applyBranding, injectCustomCSS } from "../../shared/utils/branding";

export default function TenantSettings() {
  const tenant = useQuery(api.queries.tenants.getCurrentTenant);
  const updateBranding = useMutation(api.mutations.tenants.updateBranding);
  const updateDomain = useMutation(api.mutations.tenants.updateCustomDomain);
  const generateUploadUrl = useMutation(api.actions.fileUpload.generateUploadUrl);
  const [branding, setBranding] = useState({
    primaryColor: "",
    secondaryColor: "",
    accentColor: "",
    fontFamily: "",
    theme: "light" as "light" | "dark",
    customCss: "",
  });
  const [customDomain, setCustomDomain] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    if (tenant?.branding) {
      setBranding({
        primaryColor: tenant.branding.primaryColor || "",
        secondaryColor: tenant.branding.secondaryColor || "",
        accentColor: tenant.branding.accentColor || "",
        fontFamily: tenant.branding.fontFamily || "",
        theme: tenant.branding.theme || "light",
        customCss: tenant.branding.customCss || "",
      });
      setCustomDomain(tenant.customDomain || "");
      
      // Apply branding immediately
      applyBranding(tenant.branding);
      if (tenant.branding.customCss) {
        injectCustomCSS(tenant.branding.customCss);
      }
    }
  }, [tenant]);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !tenant) return;

    setUploadingLogo(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      await updateBranding({
        tenantId: tenant._id,
        branding: {
          ...branding,
          logo: storageId,
        },
      });
    } catch (error) {
      console.error("Failed to upload logo:", error);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSaveBranding = async () => {
    if (!tenant) return;
    setSaving(true);
    try {
      await updateBranding({
        tenantId: tenant._id,
        branding: {
          ...branding,
          primaryColor: branding.primaryColor || undefined,
          secondaryColor: branding.secondaryColor || undefined,
          accentColor: branding.accentColor || undefined,
          fontFamily: branding.fontFamily || undefined,
          theme: branding.theme,
          customCss: branding.customCss || undefined,
        },
      });
      applyBranding(branding);
      if (branding.customCss) {
        injectCustomCSS(branding.customCss);
      }
    } catch (error) {
      console.error("Failed to save branding:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDomain = async () => {
    if (!tenant) return;
    setSaving(true);
    try {
      await updateDomain({
        tenantId: tenant._id,
        customDomain: customDomain || undefined,
      });
    } catch (error) {
      console.error("Failed to save domain:", error);
    } finally {
      setSaving(false);
    }
  };

  if (tenant === undefined) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your tenant settings</p>
      </div>

      <div className="space-y-6">
        {/* Branding Settings */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Branding
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo
              </label>
              <div className="flex items-center space-x-4">
                {tenant.branding?.logo && (
                  <img
                    src={`/api/storage/${tenant.branding.logo}`}
                    alt="Logo"
                    className="h-16 w-16 object-contain"
                  />
                )}
                <label className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  {uploadingLogo ? "Uploading..." : "Upload Logo"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Color
              </label>
              <input
                type="color"
                value={branding.primaryColor || "#000000"}
                onChange={(e) =>
                  setBranding({ ...branding, primaryColor: e.target.value })
                }
                className="w-full h-10 rounded border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Secondary Color
              </label>
              <input
                type="color"
                value={branding.secondaryColor || "#000000"}
                onChange={(e) =>
                  setBranding({ ...branding, secondaryColor: e.target.value })
                }
                className="w-full h-10 rounded border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Accent Color
              </label>
              <input
                type="color"
                value={branding.accentColor || "#000000"}
                onChange={(e) =>
                  setBranding({ ...branding, accentColor: e.target.value })
                }
                className="w-full h-10 rounded border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Font Family
              </label>
              <select
                value={branding.fontFamily}
                onChange={(e) =>
                  setBranding({ ...branding, fontFamily: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">Default</option>
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Lato">Lato</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <select
                value={branding.theme}
                onChange={(e) =>
                  setBranding({
                    ...branding,
                    theme: e.target.value as "light" | "dark",
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom CSS
              </label>
              <textarea
                value={branding.customCss}
                onChange={(e) =>
                  setBranding({ ...branding, customCss: e.target.value })
                }
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                placeholder="/* Add your custom CSS here */"
              />
            </div>
            <button
              onClick={handleSaveBranding}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Branding"}
            </button>
          </div>
        </div>

        {/* Custom Domain Settings */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Custom Domain
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Domain Name
              </label>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <p className="mt-1 text-sm text-gray-500">
                Enter your custom domain name (without http:// or https://)
              </p>
            </div>
            <button
              onClick={handleSaveDomain}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Domain"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
