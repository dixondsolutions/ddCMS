import { action } from "../_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/workos";

// Default template schemas
const defaultTemplates = [
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
  {
    type: "page",
    metadata: {
      name: "Services Page",
      description: "A services page with multiple content sections",
      category: "Business",
    },
    components: [
      {
        id: "hero",
        type: "Hero",
        props: {
          title: "Our Services",
          subtitle: "Professional solutions for your business",
          ctaText: "Learn More",
          ctaLink: "#services",
        },
        styles: {
          backgroundColor: "#f9fafb",
          padding: "60px 20px",
        },
        editable: ["title", "subtitle", "ctaText", "ctaLink"],
      },
      {
        id: "service1",
        type: "ContentSection",
        props: {
          heading: "Service One",
          content: "Description of your first service offering.",
        },
        styles: {
          padding: "40px 20px",
        },
        editable: ["heading", "content"],
      },
      {
        id: "service2",
        type: "ContentSection",
        props: {
          heading: "Service Two",
          content: "Description of your second service offering.",
        },
        styles: {
          padding: "40px 20px",
        },
        editable: ["heading", "content"],
      },
    ],
  },
  {
    type: "page",
    metadata: {
      name: "Portfolio Page",
      description: "A portfolio showcase template",
      category: "Portfolio",
    },
    components: [
      {
        id: "hero",
        type: "Hero",
        props: {
          title: "Our Portfolio",
          subtitle: "See what we've created",
          ctaText: "View Projects",
          ctaLink: "#projects",
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
          heading: "Featured Projects",
          content: "Explore our latest work and creative solutions.",
        },
        styles: {
          padding: "60px 20px",
        },
        editable: ["heading", "content"],
      },
    ],
  },
];

// Seed templates into the database
export const seed = action({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get user
    const user = await ctx.runQuery(async (ctx) => {
      return await ctx.db.get(userId);
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if templates already exist
    const existingTemplates = await ctx.runQuery(async (ctx) => {
      return await ctx.db.query("templates").collect();
    });

    if (existingTemplates.length > 0) {
      return { success: true, message: "Templates already exist", count: existingTemplates.length };
    }

    // Insert default templates
    let seededCount = 0;
    for (const template of defaultTemplates) {
      await ctx.runMutation(async (ctx) => {
        await ctx.db.insert("templates", {
          name: template.metadata?.name || "Template",
          category: template.metadata?.category || "General",
          schema: template,
          isPublic: true,
          createdBy: userId,
          createdAt: Date.now(),
        });
      });
      seededCount++;
    }

    return { success: true, message: `Seeded ${seededCount} templates`, count: seededCount };
  },
});

