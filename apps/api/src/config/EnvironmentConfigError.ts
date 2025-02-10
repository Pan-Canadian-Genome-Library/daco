class EnvironmentConfigError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'EnvironmentConfigError';
	}
}
export default EnvironmentConfigError;
