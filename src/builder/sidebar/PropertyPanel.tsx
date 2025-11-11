import { useState, useEffect } from "react";

interface PropertyPanelProps {
  selectedComponent: string | null;
  onUpdate: (updates: Record<string, any>) => void;
}

export default function PropertyPanel({
  selectedComponent,
  onUpdate,
}: PropertyPanelProps) {
  const [properties, setProperties] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!selectedComponent) {
      setProperties({});
      return;
    }

    // Load component properties
    // In a real implementation, this would fetch from the template data
    setProperties({});
  }, [selectedComponent]);

  const handlePropertyChange = (key: string, value: any) => {
    const newProperties = { ...properties, [key]: value };
    setProperties(newProperties);
    onUpdate(newProperties);
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

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Properties
      </h3>
      <div className="space-y-4">
        {Object.entries(properties).map(([key, value]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              {key}
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
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
              />
            ) : (
              <input
                type="text"
                value={value || ""}
                onChange={(e) => handlePropertyChange(key, e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
              />
            )}
          </div>
        ))}
        {Object.keys(properties).length === 0 && (
          <p className="text-sm text-gray-500">
            No editable properties for this component
          </p>
        )}
      </div>
    </div>
  );
}

