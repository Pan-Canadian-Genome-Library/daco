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
| `API_URL` | The base URL used to proxy all requests to the DACO API. Default is 'http://localhost:3000' | `string` |
| `VITE_SELF_ENROLMENT_URL` | Specifies the URL endpoint for user self-enrolment. (COmanage Self-enrolment flow) | `string` |

### Production Environment Variables

Vite statically built for production, meaning that the environment variables are not inserted at run-time and instead when the application is built. DACO-UI requires a run-time solution so to resolve this, a script was made to run when the container starts which will search through placeholder values and replace them in the docker environment. This script can be found in `docker/replace-env-script.sh` for the implementation.

If needed to add more environment variables to be used in production, please add it `.env.production` with the value the same as the key(for visual sake, the following example uses a different value). Local does not need to do this and can just use the desired value.

As an example, on production build, we defined `VITE_SELF_ENROLMENT_URL = VITE_PLACEHOLDER_VALUE` in our `.env.production`. Vite will insert `VITE_PLACEHOLDER_VALUE` as a placeholder(defined in [.env.production](https://vite.dev/guide/env-and-mode.html#env-files)), this `VITE_PLACEHOLDER_VALUE` is read in our script then the placeholder replaced by the value we provide in our docker env configuration.

> [!IMPORTANT]  
> Environment variables that we want to replace MUST be prefixed with `VITE_` so that the script understands what to replace.

Example of .env.production:

```js
VITE_SELF_ENROLMENT_URL = VITE_PLACEHOLDER_VALUE;
```

Example of docker environment variables:

```yml
daco-ui:
  container_name: daco-ui
  build:
    context: .
    dockerfile: Dockerfile
    target: daco-ui
  environment:
    # VITE_PLACEHOLDER_VALUE is read in the script, then uses its value http://example.org
    # to replace placeholder defined in .env.production VITE_PLACEHOLDER_VALUE in our built app
    VITE_PLACEHOLDER_VALUE: http://example.org
```
