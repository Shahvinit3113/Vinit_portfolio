import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS featured_blog_series (
                id VARCHAR(36) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slugs TEXT NOT NULL,
                project_id VARCHAR(36) DEFAULT NULL,
                created_on DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        return NextResponse.json({ success: true, message: "Migration completed" });
    } catch (error) {
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
