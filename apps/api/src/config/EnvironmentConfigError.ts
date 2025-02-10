import { ZodError } from 'zod';

class EnvironmentConfigError extends Error {
	constructor(configName: string, zodError: ZodError) {
		super();
		this.message = `Error parsing environment variables for "${configName}" config! ${zodError.message}`;
		this.name = 'EnvironmentConfigError';
	}
}
export default EnvironmentConfigError;
