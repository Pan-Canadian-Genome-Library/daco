# PCGL DACO API

Node.js Express API for the Pan-Canadian Genome Library's Data Access Compliance Office.

This app uses features from Node ^20.9, in combination with TSX for TypeScript support, and it provides access to a Postgres database using Drizzle ORM.

## Local Development

The easiest way to run the DACO UI is by following the [general setup instructions from the workspace README](../../README.md#setup).

To run the DACO API requires a Postgres database connection. The workspace's docker-compose provides a Postgres container that is pre-configured to work with the default [environment variables](#environment-variables).

Follow these steps to prepare your local machine to run this application from source:

1. Install all npm dependencies: `pnpm i`
2. Run Docker dependencies. From the root of this workspace: `docker-compose up -d`
3. Initialize this repository: `pnpm setup`
   1. Creates a `.env` file with default values. Update the values in this file if you need to change the application configuration.
   2. Runs migrations to setup database
4. Start application: `pnpm dev`

## Environment Variables

The following environment variables can be set to configure the DACO API. If the property is listed as required, the app will fail to run without a value being provided to the server's runtime environment.

| Name                 | Description                                                                                                                                                                                                                                                                                                                                | Type      | Required                                  | Default    |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------- | ----------------------------------------- | ---------- |
| `PORT`               | Port number this service will listen to.                                                                                                                                                                                                                                                                                                   | `number`  | Optional                                  | `3000`     |
|                      |                                                                                                                                                                                                                                                                                                                                            |           |                                           |            |
| `PG_DATABASE`        | Postgres database name.                                                                                                                                                                                                                                                                                                                    | `string`  | Required                                  |            |
| `PG_HOST`            | Postgres database host address.                                                                                                                                                                                                                                                                                                            | `string`  | Required                                  |            |
| `PG_PASSWORD`        | Postgres database password.                                                                                                                                                                                                                                                                                                                | `string`  | Required                                  |            |
| `PG_USER`            | Postgres database user name.                                                                                                                                                                                                                                                                                                               | `string`  | Required                                  |            |
|                      |                                                                                                                                                                                                                                                                                                                                            |           |                                           |            |
| `SESSION_KEYS`       | Secret keys to use to encrypt and validate session tokens. This can be a single key or multiple keys as a **comma separated list**. The first key will be used for encrypting new tokens, the rest can be used to validate existing keys. An array of values can be used to rotate session secrets without invalidating existing sessions. | `string`  | Required                                  |            |
| `SESSION_MAX_AGE`    | Number of miliseconds that a session token will remain active. Must be an integer.                                                                                                                                                                                                                                                         | `number`  | Optional                                  | 30 minutes |
| `VALKEY_PORT`        | Valkey port.                                                                                                                                                                                                                                                                                                                               | `number`  | Required                                  |            |
| `VALKEY_HOST`        | Valkey host address.                                                                                                                                                                                                                                                                                                                       | `string`  | Required                                  |            |
| `VALKEY_PASSWORD`    | Valkey user password.                                                                                                                                                                                                                                                                                                                      | `string`  | Required                                  |            |
| `VALKEY_USER`        | Valkey user name.                                                                                                                                                                                                                                                                                                                          | `string`  | Required                                  |            |
|                      |                                                                                                                                                                                                                                                                                                                                            |           |                                           |            |
| `DISABLE_AUTH`       | Set this to `true` to disable auth. Any other value and this will default to auth enabled.                                                                                                                                                                                                                                                 | `boolean` | Optional                                  | `false`    |
| `APPROVED_PERMISSION_EXPIRES_IN_DAYS`       | Number of days the applicant will have **read** access to the study when application gets approved.                                                                                                                                                                                                                                                 | `number` | Optional                                  | `365` days    |
| `AUTH_CLIENT_ID`     | Client ID for OIDC Provider registered private client.                                                                                                                                                                                                                                                                                     | `string`  | Conditional <br/> `DISABLE_AUTH !== true` |            |
| `AUTH_CLIENT_SECRET` | Client Secret for OIDC Provider registered private client.                                                                                                                                                                                                                                                                                 | `string`  | Conditional <br/> `DISABLE_AUTH !== true` |            |
| `AUTH_PROVIDER_HOST` | OIDC Provider host URL.                                                                                                                                                                                                                                                                                                                    | `string`  | Conditional <br/> `DISABLE_AUTH !== true` |            |

## Unit Testing

- Unit tests are built using the [Node Test Runner](https://nodejs.org/api/test.html) and are triggered using `pnpm run test`

## Database

- This application implements a Postgres database based on the following [data model](../../docs/model/README.md) and managed by [Drizzle ORM](https://orm.drizzle.team/docs/overview)
- There is a known issue when using `pnpm drizzle-kit generate / pnpm drizzle-kit migrate` for future migrations. `generate` may work but `migrate` can throw an error that a given enum is already defined:  https://github.com/drizzle-team/drizzle-orm/issues/3206
  - The current work around is to run `pnpm drizzle-kit generate`, then use `pnpm drizzle-kit up` to update the Drizzle snapshots.
- A schema dbml (database markup language) file can be generated using the script `pnpm run dbml`. This file is found at `./src/db/schema.dbml`.
