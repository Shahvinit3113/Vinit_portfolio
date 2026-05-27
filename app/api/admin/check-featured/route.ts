import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [projects] = await db.query("SELECT id, title, featured FROM projects");
        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
