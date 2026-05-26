// Run this script to apply blog_likes migration
// Usage: node scripts/apply_blog_likes_migration.js

const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

async function runMigration() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        charset: "utf8mb4",
        multipleStatements: true,
    });

    try {
        console.log("Connected to database.");

        const sqlPath = path.join(__dirname, "../server/migrations/blog_likes.sql");
        const sql = fs.readFileSync(sqlPath, "utf8");

        console.log("Running migration...");
        await connection.query(sql);

        console.log("✅ Migration completed successfully!");
        console.log("Created tables: blog_likes, blog_comments");
    } catch (error) {
        console.error("❌ Migration failed:", error.message);
    } finally {
        await connection.end();
    }
}

runMigration();
