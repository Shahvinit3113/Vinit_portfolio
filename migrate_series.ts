import 'dotenv/config';
import { db } from "./server/db";

async function run() {
    try {
        console.log("Creating featured_blog_series table...");
        
        await db.query(`
            CREATE TABLE IF NOT EXISTS featured_blog_series (
                id VARCHAR(36) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slugs TEXT NOT NULL,
                project_id VARCHAR(36) DEFAULT NULL,
                created_on DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("Table featured_blog_series created successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

run();
