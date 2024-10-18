# Pan Canadian Genome Library DACO

-

</br>

> \_{PCGL DACO}

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

- This project uses Node ^20.1, Typescript ^5.5, and PNPM ^9.10, and was created using Vite 5.4.1.

### Setup

- Install PNPM: `npm i -g pnpm`

- Install dependencies: `pnpm i`

- Start server:
  `cd apps/api`
  `pnpm run dev`

- Start UI:
  `cd apps/ui`
  `pnpm run dev`

## Support & Contributions

- Filing an [issue](https://github.com/Pan-Canadian-Genome-Library/daco/issues)
