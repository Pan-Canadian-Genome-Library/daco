# Pan Canadian Genome Library DACO

-

</br>

> <div>
> <img align="left" src="ov-logo.png" height="90"/>
> </div>
>
> _{PCGL DACO} is part of [Overture](https://www.overture.bio/), a collection of open-source software microservices used to create platforms for researchers to organize and share genomics data._

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

### Setup

## Documentation

- [Postgres Database](https://www.postgresql.org/) For data storage

## Support & Contributions

- Filing an [issue](https://github.com/Pan-Canadian-Genome-Library/daco/issues)
- Making a [contribution](https://github.com/overture-stack/.github/blob/master/CONTRIBUTING.md)
- Connect with us on [Slack](http://slack.overture.bio)
