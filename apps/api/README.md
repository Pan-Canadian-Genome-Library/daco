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
| `PG_HOST`                                | URL for the Postgres DB service. application                                                                                             | `string` | Optional | `localhost:5432`                                                                                                                                        |
| `PG_DATABASE`                              | Postgres Database name. application                                                                                           | `string` | Optional | `postgres`                                                                                                                                        |

### Unit Testing

- Unit tests are built using the [Node Test Runner](https://nodejs.org/api/test.html) and are triggered using `pnpm run test`

### Database

- This application implements a Postgres database based on the following [data model](../../docs/model/README.md) and managed by [Drizzle ORM](https://orm.drizzle.team/docs/overview)
