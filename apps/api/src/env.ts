// // import dotenv from 'dotenv';

// type EnvironmentVariables = ReturnType<typeof initializeEnvironmentVariables>;
// let env: EnvironmentVariables;

// // TODO: Replace placeholder environment variable validation with full schema validation (zod)
// const getRequired = (key: string) => {
// 	const output = process.env[key];
// 	if (output === undefined || output === '') {
// 		throw new Error(`Environment variable "${key}" is required and no value was provided.`);
// 	}
// 	return output;
// };

// const getWithDefault = (key: string, fallback: string) => {
// 	const output = process.env[key];
// 	return output === undefined || output === '' ? fallback : output;
// };

// const convertToNumber = (value?: string) => {
// 	if (value === undefined || value === '') {
// 		return undefined;
// 	}
// 	const output = Number(value);
// 	if (isNaN(output) || !isFinite(output)) {
// 		throw new Error(`Environment variable must be a number, but was given the value: ${value}`);
// 	}
// 	return output;
// };

// const initializeEnvironmentVariables = () => {
// 	return {
// 		nodeEnv: getWithDefault('NODE_ENV', 'development'),
// 		isProduction: getWithDefault('NODE_ENV', '') === 'production',
// 		express: { port: convertToNumber(getWithDefault('PORT', '3000')) },
// 		db: {
// 			user: getRequired('PG_USER'),
// 			password: getRequired('PG_PASSWORD'),
// 			host: getRequired('PG_HOST'),
// 			dbName: getRequired('PG_DATABASE'),
// 		},
// 	};
// };

// const getEnv = () => {
// 	if (env) {
// 		return env;
// 	}

// 	dotenv.config();
// 	env = initializeEnvironmentVariables();
// 	return env;
// };

// export default getEnv;
