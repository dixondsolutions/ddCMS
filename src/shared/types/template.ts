// Template schema types and definitions
export interface TemplateComponent {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: TemplateComponent[];
  styles?: Record<string, string>;
  editable?: string[];
}

export interface TemplateSchema {
  type: "page";
  components: TemplateComponent[];
  metadata?: {
    name: string;
    description?: string;
    category?: string;
  };
}

// Example template schemas
export const defaultTemplates: TemplateSchema[] = [
  {
    type: "page",
    metadata: {
      name: "Landing Page",
      description: "A simple landing page template",
      category: "Landing",
    },
    components: [
      {
        id: "hero",
        type: "Hero",
        props: {
          title: "Welcome to Our Website",
          subtitle: "Build amazing websites with ease",
          ctaText: "Get Started",
          ctaLink: "/signup",
        },
        styles: {
          backgroundColor: "#ffffff",
          padding: "80px 20px",
        },
        editable: ["title", "subtitle", "ctaText", "ctaLink"],
      },
      {
        id: "content",
        type: "ContentSection",
        props: {
          heading: "About Us",
          content:
            "This is a sample content section. You can edit this text to customize your page.",
        },
        styles: {
          padding: "60px 20px",
        },
        editable: ["heading", "content"],
      },
      {
        id: "footer",
        type: "Footer",
        props: {
          copyright: "© 2024 Your Company",
          links: [
            { text: "Privacy", href: "/privacy" },
            { text: "Terms", href: "/terms" },
          ],
        },
        editable: ["copyright"],
      },
    ],
  },
  {
    type: "page",
    metadata: {
      name: "About Page",
      description: "A simple about page template",
      category: "Content",
    },
    components: [
      {
        id: "header",
        type: "Header",
        props: {
          title: "About Us",
        },
        styles: {
          padding: "40px 20px",
        },
        editable: ["title"],
      },
      {
        id: "content",
        type: "ContentSection",
        props: {
          heading: "Our Story",
          content:
            "Tell your story here. This template provides a clean layout for sharing information about your company or organization.",
        },
        styles: {
          padding: "60px 20px",
        },
        editable: ["heading", "content"],
      },
    ],
  },
  {
    type: "page",
    metadata: {
      name: "Contact Page",
      description: "A contact page with form",
      category: "Contact",
    },
    components: [
      {
        id: "header",
        type: "Header",
        props: {
          title: "Contact Us",
        },
        styles: {
          padding: "40px 20px",
        },
        editable: ["title"],
      },
      {
        id: "contact-form",
        type: "ContactForm",
        props: {
          fields: [
            { name: "name", label: "Name", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "message", label: "Message", type: "textarea", required: true },
          ],
          submitText: "Send Message",
        },
        editable: ["submitText"],
      },
    ],
  },
];

