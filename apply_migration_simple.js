
// apply_migration_simple.ts
// Uses mysql2 directly. Requires dotenv.
require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function run() {
    console.log("Starting migration...");
    try {
        const connection = await mysql.createConnection({
            host: "bnqbnctylez7kikru54q-mysql.services.clever-cloud.com",
            user: "uzihuoxvbywt4bng",
            password: "7273IFDWeivb9mzgAp0K",
            database: "bnqbnctylez7kikru54q",
            charset: "utf8mb4"
        });

        console.log("Connected to database.");

        const query = `
            CREATE TABLE IF NOT EXISTS competencies (
                id VARCHAR(36) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                created_on DATETIME DEFAULT CURRENT_TIMESTAMP
            );
            
            ALTER TABLE competencies ADD COLUMN IF NOT EXISTS description TEXT;
        `;

        await connection.query(query);
        console.log("Migration SUCCESS: 'competencies' table ready.");
        await connection.end();
    } catch (error) {
        console.error("Migration FAILED:", error);
    }
}

run();
