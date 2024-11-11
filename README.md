# Pan Canadian Genome Library Data Access Compliance Office

<img src="./apps/ui/public/pcgl-logo.png" height="90" align="right" />

Canada boasts world-leading expertise in genomics, including developing data-sharing policies and tools. However, we lack a national strategy to aggregate, store and share Canadian data equitably, securely and sustainably. At the same time, the size and complexity of human genomics datasets and their associated clinical data are growing rapidly.

The Pan-Canadian Genome Library (PCGL) is a large collaborative effort to unify Canada's genome sequencing efforts. The PCGL is an open-source and open-science initiative, building upon Canadian-made foundational components and datasets, and utilizing international standards such as GA4GH to unify Canada’s human genome sequencing efforts.

## Repository Structure

The repository is organized with the following directory structure:

```
.
├── apps/
│   ├── ui
│   └── api
└── packages/
    └── types
```

The modules in the monorepo are organized into two categories:

- **apps/** - Standalone processes meant to be run. These are published to [ghcr.io](https://ghcr.io) as container images.
- **packages/** - Reusable packages shared between applications and other packages. Packages are published to [NPM](https://npmjs.com).

## Local Development

### Development Tools

- [PNPM](https://pnpm.io/) Project manager
- [Node.js](https://nodejs.org/en) Runtime environment (v20 or higher)
- [VS Code](https://code.visualstudio.com/) As recommended code editor. Plugins recommended: ESLint, Prettier - Code formatter, Mocha Test Explorer, Monorepo Workspace

### System Dependencies

- This project uses Node ^20.9, Typescript ^5.5, and PNPM ^9.10, and was created using Vite 5.4.1.

### Setup

- Install PNPM: `npm i -g pnpm`

- Install dependencies: `pnpm i`

- Start server:
  
  `cd apps/api`

  Create .env file: `cp .env.schema .env`

  Start Postgres DB: `docker compose up --detach`
  
  `pnpm run dev`
  
  The server is now listening for requests at `http://localhost:3000`

- Start UI:

  `cd apps/ui`

  `cp .env.schema .env`

  `pnpm run dev`

  Visit `http://localhost:5173/` in the browser to get started

## Support & Contributions

- Filing an [issue](https://github.com/Pan-Canadian-Genome-Library/daco/issues)
