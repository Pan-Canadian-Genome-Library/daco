# PCGL DACO API

Node.js Express API for the Pan-Canadian Genome Library's Data Access Compliance Office.

This app uses features from Node ^20.9, in combination with TSX for TypeScript support, and it provides access to a Postgres database using Drizzle ORM.

## Local Development

The easiest way to run the DACO UI is by following the [general setup instructions from the workspace README](../../README.md#setup).

To run the DACO API requires a Postgres database connection. The workspace's docker-compose provides a Postgres container that is pre-configured to work with the default [environment variables](#environment-variables).

Follow these steps to prepare your local machine to run this application from source:

1. Install all npm dependencies: `pnpm i`
2. Run Docker dependencies. From the root of this workspace: `docker-compose up`
3. Initialize this repository: `pnpm setup`
   1. Creates a `.env` file with default values. Update the values in this file if you need to change the application configuration.
   2. Runs migrations to setup database
4. Start application: `pnpm dev`

## Environment Variables

The following environment variables can be set to configure the DACO API. If the property is listed as required, the app will fail to run without a value being provided to the server's runtime environment.

| Name          | Description                                               | Type      | Required | Default          |
| ------------- | --------------------------------------------------------- | --------- | -------- | ---------------- |
| `PORT`        | Port number this service will listen to.                  | `number`  | Optional | `3000`           |
| `PG_USER`     | Postgres Database User name.                              | `string`  | Optional | `postgres`       |
| `PG_PASSWORD` | Postgres Database password.                               | `string`  | Optional | `mypassword`     |
| `PG_HOST`     | URL for the Postgres DB service.                          | `string`  | Optional | `localhost:5432` |
| `PG_DATABASE` | Postgres Database name.                                   | `string`  | Optional | `postgres`       |
| `IS_PROD`     | Determines if application is deployed in production mode. | `boolean` | Optional | `false`          |

## Unit Testing

- Unit tests are built using the [Node Test Runner](https://nodejs.org/api/test.html) and are triggered using `pnpm run test`

## Database

- This application implements a Postgres database based on the following [data model](../../docs/model/README.md) and managed by [Drizzle ORM](https://orm.drizzle.team/docs/overview)
- Drizzle is configured to read the schema from the build directory (`/dist`) due to a known Drizzle Kit issue with ESM imports. Any Drizzle Kit operations (including migrations) require first building the application with `pnpm run build`.
  - See // https://github.com/drizzle-team/drizzle-orm/issues/2705 for more information.
- In addition, there is a known issue when using `pnpm drizzle-kit generate / pnpm drizzle-kit migrate` for future migrations. `generate` may work but `migrate` can throw an error that a given enum is already defined:  https://github.com/drizzle-team/drizzle-orm/issues/3206
  - The current work around is to run `pnpm drizzle-kit generate`, then use `pnpm drizzle-kit up` to update the Drizzle snapshots.
- A schema dbml (database markup language) file can be generated using the script `pnpm run dbml`. This file is found at `./src/db/schema.dbml`.
