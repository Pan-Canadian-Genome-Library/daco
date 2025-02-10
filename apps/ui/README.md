# PCGL DACO UI

Client application for the Pan Canadian Genome Library Data Access Compliance Office.

## Local Development

The easiest way to run the DACO UI is by following the [general setup instructions from the workspace README](../../README.md#setup)

The UI can be run without any other dependencies but it will not be able to perform any data-fetching or render pages dependant on server data without also running the DACO API.

To run the PCGL DACO UI directly:
1. Make sure all npm dependencies have been installed: `pnpm i`
2. From this directory (`./apps/ui`) run: `pnpm dev`

This will start the [Vite](https://vitejs.dev/) dev server and host the the UI at: http://localhost:5174