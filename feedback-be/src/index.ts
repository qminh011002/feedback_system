import express from 'express';
import pool from './config/database';
import cors from 'cors';
import { VERSION_API } from './constants/app';
import appRouter from './routes/index.routes';
import { errorHandler } from './utils/errorHandler';
import { Client } from 'pg';

const app = express();

// Connect to database
pool.connect()
	.then((client) => {
		console.log(`🛝 Connect to database [${(client as unknown as Client).database}] successfully`);
	})
	.catch((error) => {
		console.log('❌ Failed to connect to the database:', error.message);
	});

// Standard middleware
app.use(
	cors({
		origin: '*'
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(VERSION_API, appRouter);

// Error handler
app.use(errorHandler);

// Server start
app.listen(process.env.SERVER_PORT, () => {
	console.log(`🚀 Server is running on port::${process.env.SERVER_PORT}`);
});
