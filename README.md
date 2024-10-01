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

## Local development

### Development tools

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

## Related Software

The Overture Platform includes the following Overture Components:

</br>

| Software                                                | Description                                                                             |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [Score](https://github.com/overture-stack/score/)       | Transfer data to and from any cloud-based storage system                                |
| [Song](https://github.com/overture-stack/song/)         | Catalog and manage metadata associated to file data spread across cloud storage systems |
| [Maestro](https://github.com/overture-stack/maestro/)   | Organizing your distributed data into a centralized Elasticsearch index                 |
| [Arranger](https://github.com/overture-stack/arranger/) | A search API with reusable search UI components                                         |
| [Stage](https://github.com/overture-stack/stage)        | A React-based front-data portal UI                                                      |
| [Lyric](https://github.com/overture-stack/lyric)        | A data-agnostic tabular data submission system                                          |
| [Lectern](https://github.com/overture-stack/lectern)    | A simple web browser UI that integrates Ego and Arranger                                |
