const mysql = require("mysql2/promise");

(async () => {
    const db = await mysql.createConnection({
        host: "bnqbnctylez7kikru54q-mysql.services.clever-cloud.com",
        user: "uzihuoxvbywt4bng",
        password: "7273IFDWeivb9mzgAp0K",
        database: "bnqbnctylez7kikru54q",
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
