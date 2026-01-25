import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [rows] = await db.query("SELECT * FROM featured_blogs ORDER BY created_on DESC");
        return NextResponse.json(rows);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch featured blogs" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { slug } = await request.json();
        if (!slug) return NextResponse.json({ error: "Slug is required" }, { status: 400 });

        const id = crypto.randomUUID();
        await db.query("INSERT INTO featured_blogs (id, slug) VALUES (?, ?)", [id, slug.trim()]);

        return NextResponse.json({ success: true, id, slug });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ error: "Already featured" }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to add featured blog" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const { slug, project_id } = await request.json();
        if (!slug) return NextResponse.json({ error: "Slug is required" }, { status: 400 });

        await db.query(
            "UPDATE featured_blogs SET project_id = ? WHERE slug = ?",
            [project_id || null, slug]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating featured blog:", error);
        return NextResponse.json({ error: "Failed to update featured blog" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get("slug");
        if (!slug) return NextResponse.json({ error: "Slug is required" }, { status: 400 });

        await db.query("DELETE FROM featured_blogs WHERE slug = ?", [slug]);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to remove featured blog" }, { status: 500 });
    }
}

