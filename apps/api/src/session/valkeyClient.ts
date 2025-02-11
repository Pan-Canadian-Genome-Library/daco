import { Redis } from 'ioredis';
import { valkeyConfig } from './config/valkeyConfig.js';

const valkeyClient = new Redis({
	port: valkeyConfig.VALKEY_PORT,
	host: valkeyConfig.VALKEY_HOST,
	username: valkeyConfig.VALKEY_USER,
	password: valkeyConfig.VALKEY_PASSWORD,
});

export default valkeyClient;
