import mysql from "mysql2/promise";

// Singleton pattern for Next.js hot reload - prevents multiple pools
const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof mysql.createPool> | undefined;
};

export const db =
  globalForDb.db ??
  mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: "utf8mb4",
    connectionLimit: 1, // STRICT LIMIT: Clever Cloud free tier allows only 5 connections total. Next.js build runs multiple workers.
    waitForConnections: true,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    connectTimeout: 10000, // 10 second timeout for serverless cold starts
  });

globalForDb.db = db;

