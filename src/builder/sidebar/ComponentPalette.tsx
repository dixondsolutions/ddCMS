import { Hero, ContentSection, Header, Footer, ContactForm } from "../../shared/components/TemplateComponents";
import { Plus } from "lucide-react";

interface ComponentPaletteProps {
  onSelectComponent: (component: any) => void;
}

const availableComponents = [
  {
    type: "Hero",
    name: "Hero Section",
    icon: "🎯",
    defaultProps: {
      title: "Welcome",
      subtitle: "Add your subtitle here",
      ctaText: "Get Started",
      ctaLink: "#",
    },
  },
  {
    type: "ContentSection",
    name: "Content Section",
    icon: "📄",
    defaultProps: {
      heading: "Heading",
      content: "Add your content here",
    },
  },
  {
    type: "Header",
    name: "Header",
    icon: "📋",
    defaultProps: {
      title: "Page Title",
    },
  },
  {
    type: "Footer",
    name: "Footer",
    icon: "⬇️",
    defaultProps: {
      copyright: "© 2024",
      links: [],
    },
  },
  {
    type: "ContactForm",
    name: "Contact Form",
    icon: "📧",
    defaultProps: {
      fields: [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "message", label: "Message", type: "textarea", required: true },
      ],
      submitText: "Submit",
    },
  },
];

export default function ComponentPalette({ onSelectComponent }: ComponentPaletteProps) {
  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Components</h3>
      <div className="space-y-2">
        {availableComponents.map((component) => (
          <button
            key={component.type}
            onClick={() =>
              onSelectComponent({
                id: `${component.type.toLowerCase()}-${Date.now()}`,
                type: component.type,
                props: component.defaultProps,
                editable: Object.keys(component.defaultProps),
              })
            }
            className="w-full px-3 py-3 text-left text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors flex items-center"
          >
            <span className="text-xl mr-3">{component.icon}</span>
            <span className="font-medium">{component.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

