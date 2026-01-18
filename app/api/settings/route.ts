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
        return NextResponse.json({}, { status: 200 }); // Return empty on error for public
    }
}
