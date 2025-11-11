import { useState, useEffect } from "react";
import type { TemplateSchema, TemplateComponent } from "../../shared/types/template";

interface PropertyPanelProps {
  selectedComponent: string | null;
  templateData: TemplateSchema | null;
  onUpdate: (updates: Partial<TemplateComponent>) => void;
}

export default function PropertyPanel({
  selectedComponent,
  templateData,
  onUpdate,
}: PropertyPanelProps) {
  const [component, setComponent] = useState<TemplateComponent | null>(null);

  useEffect(() => {
    if (!selectedComponent || !templateData) {
      setComponent(null);
      return;
    }

    // Find the selected component in the template data
    const found = templateData.components.find((c) => c.id === selectedComponent);
    setComponent(found || null);
  }, [selectedComponent, templateData]);

  const handlePropertyChange = (key: string, value: any) => {
    if (!component) return;

    // Update props
    const newProps = { ...component.props, [key]: value };
    onUpdate({ props: newProps });
  };

  const handleStyleChange = (key: string, value: string) => {
    if (!component) return;

    // Update styles
    const newStyles = { ...component.styles, [key]: value };
    onUpdate({ styles: newStyles });
  };

  if (!selectedComponent) {
    return (
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Properties
        </h3>
        <p className="text-sm text-gray-500">
          Select a component to edit its properties
        </p>
      </div>
    );
  }

  if (!component) {
    return (
      <div className="p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Properties
        </h3>
        <p className="text-sm text-gray-500">
          Component not found
        </p>
      </div>
    );
  }

  // Filter editable properties
  const editableProps = component.editable || Object.keys(component.props);

  return (
    <div className="p-4">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          {component.type}
        </h3>
        <p className="text-xs text-gray-500">
          Component ID: {component.id}
        </p>
      </div>

      {/* Properties Section */}
      <div className="mb-6">
        <h4 className="text-xs font-semibold text-gray-700 mb-3 uppercase">
          Properties
        </h4>
        <div className="space-y-4">
          {editableProps.map((key) => {
            const value = component.props[key];
            return (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </label>
                {typeof value === "boolean" ? (
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handlePropertyChange(key, e.target.checked)}
                    className="rounded border-gray-300"
                  />
                ) : typeof value === "number" ? (
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      handlePropertyChange(key, parseFloat(e.target.value))
                    }
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : key.toLowerCase().includes("color") ? (
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={value || "#000000"}
                      onChange={(e) => handlePropertyChange(key, e.target.value)}
                      className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={value || ""}
                      onChange={(e) => handlePropertyChange(key, e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="#000000"
                    />
                  </div>
                ) : (
                  <textarea
                    value={value || ""}
                    onChange={(e) => handlePropertyChange(key, e.target.value)}
                    rows={value && value.length > 50 ? 3 : 2}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Styles Section */}
      {component.styles && (
        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-3 uppercase">
            Styles
          </h4>
          <div className="space-y-4">
            {Object.entries(component.styles).map(([key, value]) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </label>
                {key.toLowerCase().includes("color") ? (
                  <div className="flex space-x-2">
                    <input
                      type="color"
                      value={value || "#000000"}
                      onChange={(e) => handleStyleChange(key, e.target.value)}
                      className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={value || ""}
                      onChange={(e) => handleStyleChange(key, e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="#000000"
                    />
                  </div>
                ) : (
                  <input
                    type="text"
                    value={value || ""}
                    onChange={(e) => handleStyleChange(key, e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
