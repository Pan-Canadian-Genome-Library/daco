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
    ├── data-model
    ├── logger
    └── validation
```


| Component                                   | Package Name          | Path                | Description                                                          |
| ------------------------------------------- | --------------------- | ------------------- | -------------------------------------------------------------------- |
| [DACO UI](apps/ui/README.md)            | @pcgl-daco/ui         | apps/ui             | React SPA website for PCGL Daco.                                     |
| [DACO API](apps/api/README.md)       | @pcgl-daco/api        | apps/api            | ExpressJS backend-for-frontend server for                            |
|                                             |                       |                     |                                                                      |
| [data-model](packages/data-model/README.md) | @pcgl-daco/data-model | packages/data-model | DACO database schemas and generated types.                           |
| [logger](packages/logger/README.md)         | @pcgl-daco/logger     | packages/logger     | Standardized reusable logger and express middleware request logging. |
| [validation](packages/validation/README.md) | @pcgl-daco/validation | packages/validation | Shared type schemas for API and UI.                                  |


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

Follow these steps to install and run all dependencies, then run all applications locally. The applications will run in development mode, monitoring the code base to rebuild and restart the applications when the code is updated.

- Install PNPM: `npm i -g pnpm`
- Install dependencies: `pnpm i`
- Run dependencies: `docker-compose up -d`
- Initialize application environment files: `pnpm setup:all`
  - This will fail if you have already made any `.env` files inside any of the `/apps` dirs. If this is the case, try removing these files before retrying the script.
  - This will also run the initial database migration for the DACO API, so make sure the docker dependencies are running.
- Start all apps in development mode: `pnpm dev:all`
	- The DACO API server will run at `http://localhost:3000`. Visit `http://localhost:3000/api-docs` for interactive swagger.
	- The UI will be running at `http://localhost:5173`

## Support & Contributions

- Filing an [issue](https://github.com/Pan-Canadian-Genome-Library/daco/issues)
