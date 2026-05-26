const mysql = require("mysql2/promise");

(async () => {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        charset: "utf8mb4",
    });

    try {
        await db.query(`
      ALTER TABLE projects 
      MODIFY COLUMN image VARCHAR(255) 
      CHARACTER SET utf8mb4 
      COLLATE utf8mb4_unicode_ci 
      DEFAULT ''
    `);
        console.log("✅ 'image' column updated to support emojis!");
    } catch (err) {
        console.error("Error:", err.message);
    } finally {
        await db.end();
        process.exit(0);
    }
})();
