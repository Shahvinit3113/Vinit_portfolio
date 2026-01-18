import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [rows] = await db.query<any[]>("SELECT setting_key, setting_value FROM user_settings");
        const settings: Record<string, string> = {};
        rows.forEach((row) => {
            settings[row.setting_key] = row.setting_value || "";
        });
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const settings = await request.json();

        for (const [key, value] of Object.entries(settings)) {
            const id = crypto.randomUUID();
            await db.query(
                `INSERT INTO user_settings (id, setting_key, setting_value) 
                 VALUES (?, ?, ?) 
                 ON DUPLICATE KEY UPDATE setting_value = ?`,
                [id, key, value, value]
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
    }
}
