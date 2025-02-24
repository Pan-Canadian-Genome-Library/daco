# PCGL DACO UI

Client application for the Pan Canadian Genome Library Data Access Compliance Office.

## Local Development

The easiest way to run the DACO UI is by following the [general setup instructions from the workspace README](../../README.md#setup).

The UI can be run without any other dependencies but it will not be able to perform any data-fetching or render pages dependant on server data without also running the DACO API.

To run the PCGL DACO UI directly:
1. Make sure all npm dependencies have been installed: `pnpm i`
2. From this directory (`./apps/ui`) run: `pnpm dev`

This will start the [Vite](https://vitejs.dev/) dev server and host the the UI at: http://localhost:5174

### Environment Variables

These environment variables can be used for local development to change the behaviour of the UI. All env variables are optional and are undefined by default.

To use environment variables, copy the file `.env.schema` to `.env` and modify any of the provided values.

| Name           | Description                                                                                                                                                                 | Type     |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `DISABLE_AUTH` | If set to `true`, all protected routes will be available regardless of the user. This allows development of protected pages withour required an authenticated user session. | `string` |
