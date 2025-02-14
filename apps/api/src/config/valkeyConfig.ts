import { z } from 'zod';
import EnvironmentConfigError from './EnvironmentConfigError.js';

const serverConfigSchema = z.object({
	VALKEY_HOST: z.string(),
	VALKEY_PORT: z.coerce.number().int(),
	VALKEY_USER: z.string(),
	VALKEY_PASSWORD: z.string(),
});

const parseResult = serverConfigSchema.safeParse(process.env);

if (!parseResult.success) {
	throw new EnvironmentConfigError(`valkey`, parseResult.error);
}

export const valkeyConfig = parseResult.data;
