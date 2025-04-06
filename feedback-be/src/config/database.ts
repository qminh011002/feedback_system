import { Pool } from 'pg';
import 'dotenv/config';

const pool = new Pool({
	user: process.env.DB_USERNAME,
	database: process.env.DB,
	password: process.env.DB_PASSWORD,
	host: process.env.DB_HOST,
	port: +(process.env.DB_PORT || 5432)
});

// pool.on('connect', (client) => {
// 	console.log(`🛝 Connect to database [${(client as unknown as Client).database}] successfully`);
// });

export default pool;
