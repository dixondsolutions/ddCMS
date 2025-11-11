# ddCMS - AI-Powered Agency Website Builder

An AI-powered Content Management System built for agencies to quickly create and manage client websites.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Convex (serverless backend)
- **Authentication**: WorkOS
- **AI**: Anthropic Claude
- **Styling**: Tailwind CSS
- **State Management**: Zustand

## Prerequisites

- Node.js 18+ and npm
- A Convex account ([sign up at convex.dev](https://dashboard.convex.dev))
- A WorkOS account ([sign up at workos.com](https://dashboard.workos.com))
- An Anthropic API key ([get one at console.anthropic.com](https://console.anthropic.com))

## Environment Variables

Create a `.env` file in the root directory with the following variables:

### Required Variables

```env
# Convex Configuration
VITE_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOY_KEY=your_convex_deploy_key_here

# WorkOS Configuration
VITE_WORKOS_CLIENT_ID=your_workos_client_id_here

# Anthropic API Key (for AI features)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### Getting Your Keys

#### Convex Setup
1. Go to [Convex Dashboard](https://dashboard.convex.dev)
2. Create a new project or select existing one
3. Copy the deployment URL for `VITE_CONVEX_URL`
4. Go to Settings → Deploy Keys to get `CONVEX_DEPLOY_KEY`

#### WorkOS Setup
1. Go to [WorkOS Dashboard](https://dashboard.workos.com)
2. Create a new application or select existing one
3. Copy the Client ID for `VITE_WORKOS_CLIENT_ID`
4. Configure redirect URIs for your application

#### Anthropic Setup
1. Go to [Anthropic Console](https://console.anthropic.com)
2. Generate an API key
3. Copy it for `ANTHROPIC_API_KEY`

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ddCMS
```

2. Install dependencies:
```bash
npm install
```

3. Copy the example environment file:
```bash
cp .env.example .env
```

4. Fill in your environment variables in `.env`

5. Run Convex codegen to generate types:
```bash
npx convex dev
```

This will start the Convex development server and generate TypeScript types.

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

In a separate terminal, keep Convex running:

```bash
npx convex dev
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
ddCMS/
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── lib/             # Utilities and helpers
│   └── App.tsx          # Main app component
├── convex/              # Convex backend
│   ├── schema.ts        # Database schema
│   ├── *.ts             # Queries, mutations, and actions
│   └── _generated/      # Auto-generated types
├── .env                 # Environment variables (create this)
├── .env.example         # Example environment file
└── package.json         # Dependencies
```

## Features

- 🎨 Visual page builder with drag-and-drop
- 🤖 AI-powered content generation
- 📱 Responsive templates
- 👥 Multi-tenant architecture
- 🔐 WorkOS authentication
- 📸 Media library
- 🌐 Custom domain support
- 📊 Analytics dashboard

## Development Roadmap

See `claude.todo` for the complete development roadmap and task list.

## License

Private - All Rights Reserved
