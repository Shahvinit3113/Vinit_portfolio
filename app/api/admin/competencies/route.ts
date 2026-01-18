
import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [rows] = await db.query("SELECT * FROM competencies ORDER BY created_on ASC");
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch competencies" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { name, description } = await request.json();
        if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

        const id = crypto.randomUUID();
        await db.query("INSERT INTO competencies (id, name, description) VALUES (?, ?, ?)", [id, name.trim(), description || ""]);

        return NextResponse.json({ success: true, id, name, description });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create competency" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

        await db.query("DELETE FROM competencies WHERE id = ?", [id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete competency" }, { status: 500 });
    }
}
