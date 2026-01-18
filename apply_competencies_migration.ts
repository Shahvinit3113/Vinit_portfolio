import { db } from "./server/db";

async function run() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS competencies (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                created_on DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Migration applied: Created competencies table");
    } catch (error) {
        console.error("Migration failed:", error);
    }
    process.exit(0);
}

run();
