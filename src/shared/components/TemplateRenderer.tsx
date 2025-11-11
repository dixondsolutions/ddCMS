import React from "react";
import { TemplateSchema, TemplateComponent } from "../types/template";
import { renderComponent } from "./TemplateComponents";

interface TemplateRendererProps {
  schema: TemplateSchema;
  data?: Record<string, any>;
}

export function TemplateRenderer({ schema, data = {} }: TemplateRendererProps) {
  // Merge template data with provided data
  const mergeData = (components: TemplateComponent[]): TemplateComponent[] => {
    return components.map((component) => {
      const componentData = data[component.id] || {};
      return {
        ...component,
        props: {
          ...component.props,
          ...componentData,
        },
        children: component.children ? mergeData(component.children) : undefined,
      };
    });
  };

  const mergedComponents = mergeData(schema.components);

  return (
    <div className="template-renderer">
      {mergedComponents.map((component) => renderComponent(component))}
    </div>
  );
}

export default TemplateRenderer;

