import { z } from 'zod';
import EnvironmentConfigError from './EnvironmentConfigError.js';

const serverConfigSchema = z.object({
	PORT: z.coerce.number().optional().default(3000),
	NODE_ENV: z.string().optional().default('development'),
	npm_package_version: z.string().optional().default('unknown'),
});

const parseResult = serverConfigSchema.safeParse(process.env);

if (!parseResult.success) {
	throw new EnvironmentConfigError(`server`, parseResult.error);
}
export const serverConfig = { ...parseResult.data, isProduction: parseResult.data.NODE_ENV === 'production' };
