// Theme system with CSS variables
export function applyBranding(branding: {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
  theme?: "light" | "dark";
}) {
  const root = document.documentElement;

  if (branding.primaryColor) {
    root.style.setProperty("--color-primary", branding.primaryColor);
  }

  if (branding.secondaryColor) {
    root.style.setProperty("--color-secondary", branding.secondaryColor);
  }

  if (branding.accentColor) {
    root.style.setProperty("--color-accent", branding.accentColor);
  }

  if (branding.fontFamily) {
    root.style.setProperty("--font-family", branding.fontFamily);
    document.body.style.fontFamily = branding.fontFamily;
  }

  if (branding.theme) {
    root.setAttribute("data-theme", branding.theme);
  }
}

export function injectCustomCSS(css: string) {
  const styleId = "custom-branding-css";
  let styleElement = document.getElementById(styleId) as HTMLStyleElement;

  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }

  styleElement.textContent = css;
}

