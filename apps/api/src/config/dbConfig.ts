import { z } from 'zod';
import EnvironmentConfigError from './EnvironmentConfigError.js';

const serverConfigSchema = z.object({
	PG_USER: z.string(),
	PG_PASSWORD: z.string(),
	PG_HOST: z.string(),
	PG_DATABASE: z.string(),
});

const parseResult = serverConfigSchema.safeParse(process.env);

if (!parseResult.success) {
	throw new EnvironmentConfigError(`db`, parseResult.error);
}

const { PG_USER, PG_PASSWORD, PG_HOST, PG_DATABASE } = parseResult.data;
const connectionString = `postgres://${PG_USER}:${PG_PASSWORD}@${PG_HOST}/${PG_DATABASE}`;

export const dbConfig = { ...parseResult.data, connectionString };
