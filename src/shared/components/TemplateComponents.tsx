import React from "react";
import { TemplateComponent } from "../types/template";

interface HeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  styles?: Record<string, string>;
}

export function Hero({ title, subtitle, ctaText, ctaLink, styles }: HeroProps) {
  return (
    <section
      className="text-center py-20 px-4"
      style={styles}
    >
      <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
      {subtitle && <p className="text-xl text-gray-600 mb-8">{subtitle}</p>}
      {ctaText && ctaLink && (
        <a
          href={ctaLink}
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {ctaText}
        </a>
      )}
    </section>
  );
}

interface ContentSectionProps {
  heading?: string;
  content?: string;
  styles?: Record<string, string>;
}

export function ContentSection({ heading, content, styles }: ContentSectionProps) {
  return (
    <section className="py-16 px-4 max-w-4xl mx-auto" style={styles}>
      {heading && <h2 className="text-3xl font-bold mb-4">{heading}</h2>}
      {content && <p className="text-gray-700 leading-relaxed">{content}</p>}
    </section>
  );
}

interface HeaderProps {
  title?: string;
  styles?: Record<string, string>;
}

export function Header({ title, styles }: HeaderProps) {
  return (
    <header className="py-10 px-4 text-center" style={styles}>
      {title && <h1 className="text-4xl font-bold">{title}</h1>}
    </header>
  );
}

interface FooterProps {
  copyright?: string;
  links?: Array<{ text: string; href: string }>;
  styles?: Record<string, string>;
}

export function Footer({ copyright, links, styles }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-8 px-4" style={styles}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        {copyright && <p className="mb-4 md:mb-0">{copyright}</p>}
        {links && links.length > 0 && (
          <nav className="flex space-x-6">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="hover:text-gray-300 transition-colors"
              >
                {link.text}
              </a>
            ))}
          </nav>
        )}
      </div>
    </footer>
  );
}

interface ContactFormProps {
  fields?: Array<{
    name: string;
    label: string;
    type: string;
    required?: boolean;
  }>;
  submitText?: string;
  styles?: Record<string, string>;
}

export function ContactForm({ fields = [], submitText = "Submit", styles }: ContactFormProps) {
  return (
    <section className="py-16 px-4 max-w-2xl mx-auto" style={styles}>
      <form className="space-y-6">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                required={field.required}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
              />
            ) : (
              <input
                type={field.type}
                name={field.name}
                required={field.required}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {submitText}
        </button>
      </form>
    </section>
  );
}

// Component registry
const componentMap: Record<string, React.ComponentType<any>> = {
  Hero,
  ContentSection,
  Header,
  Footer,
  ContactForm,
};

export function renderComponent(component: TemplateComponent): React.ReactElement {
  const Component = componentMap[component.type];
  if (!Component) {
    return <div key={component.id}>Unknown component: {component.type}</div>;
  }

  const props = {
    ...component.props,
    styles: component.styles,
  };

  if (component.children && component.children.length > 0) {
    return (
      <Component key={component.id} {...props}>
        {component.children.map((child) => renderComponent(child))}
      </Component>
    );
  }

  return <Component key={component.id} {...props} />;
}

export { componentMap };

