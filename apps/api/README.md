# PCGL DACO API

Node.js Express API for the Pan-Canadian Genome Library's Data Access Compliance Office.

This app uses features from Node ^20.9, in combination with TSX for TypeScript support, and it provides access to a Postgres database using Drizzle ORM.

## Local Development

- Follow the [Setup steps in project Readme](../../README.md)

### Environment Variables

| Name                                             | Description                                                                                                                     | Type     | Required | Default                                                                                                                                                        |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | -------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PORT`                                           | Port number this service will listen to.                                                                                        | `number` | Optional | `3000`                                                                                                                                                         |
| `PG_USER`                                       | Postgres Database User name.      | `string` | Optional | `postgres`                                                                                                                                                   |
| `PG_PASSWORD` | Postgres Database password.                                             | `string` | Optional | `mypassword`                                                                                                                          |
| `PG_HOST`                                | URL for the Postgres DB service.                                                                                              | `string` | Optional | `localhost:5432`                                                                                                                                        |
| `PG_DATABASE`                              | Postgres Database name.                                                                                            | `string` | Optional | `postgres`                                                                                                                                        |
| `IS_PROD`                              | Determines if application is deployed in production mode.                                                                                            | `boolean` | Optional | `false`                                                                                                                                        |

### Unit Testing

- Unit tests are built using the [Node Test Runner](https://nodejs.org/api/test.html) and are triggered using `pnpm run test`

### Database

- This application implements a Postgres database based on the following [data model](../../docs/model/README.md) and managed by [Drizzle ORM](https://orm.drizzle.team/docs/overview)

- Drizzle is configured to read the schema from the build directory (`/dist`) due to a known Drizzle Kit issue with ESM imports. Any Drizzle Kit operations (including migrations) require first building the application with `pnpm run build`.

- See // https://github.com/drizzle-team/drizzle-orm/issues/2705 for more information.

- In addition, there is a known issue when using `pnpm drizzle-kit generate / pnpm drizzle-kit migrate` for future migrations. `generate` may work but `migrate` can throw an error that a given enum is already defined:  https://github.com/drizzle-team/drizzle-orm/issues/3206

- The current work around is to run `pnpm drizzle-kit generate`, then use `pnpm drizzle-kit up` to update the Drizzle snapshots.

- A schema dbml (database markup language) file can be generated using the script `pnpm run dbml`. This file is found at `./src/db/schema.dbml`.
