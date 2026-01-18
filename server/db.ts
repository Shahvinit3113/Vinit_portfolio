import mysql from "mysql2/promise";

// Singleton pattern for Next.js hot reload - prevents multiple pools
const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof mysql.createPool> | undefined;
};

export const db =
  globalForDb.db ??
  mysql.createPool({
    host: "bnqbnctylez7kikru54q-mysql.services.clever-cloud.com",
    user: "uzihuoxvbywt4bng",
    password: "7273IFDWeivb9mzgAp0K",
    database: "bnqbnctylez7kikru54q",
    charset: "utf8mb4",
    connectionLimit: 1, // STRICT LIMIT: Clever Cloud free tier allows only 5 connections total. Next.js build runs multiple workers.
    waitForConnections: true,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

if (process.env.NODE_ENV !== "production") globalForDb.db = db;

