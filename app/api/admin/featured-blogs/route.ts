import { db } from "@/server/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [singleRows] = await db.query("SELECT *, 'single' as type FROM featured_blogs ORDER BY created_on DESC");
        const [seriesRows] = await db.query("SELECT *, 'series' as type FROM featured_blog_series ORDER BY created_on DESC");
        
        const combined = [...(singleRows as any[]), ...(seriesRows as any[])];
        combined.sort((a, b) => new Date(b.created_on).getTime() - new Date(a.created_on).getTime());
        
        return NextResponse.json(combined);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch featured blogs" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, slug, title, slugs } = body;
        
        if (type === 'series') {
            if (!title || !slugs || !Array.isArray(slugs)) return NextResponse.json({ error: "Title and slugs are required" }, { status: 400 });
            const id = crypto.randomUUID();
            await db.query("INSERT INTO featured_blog_series (id, title, slugs) VALUES (?, ?, ?)", [id, title, JSON.stringify(slugs)]);
            return NextResponse.json({ success: true, id, type: 'series' });
        }
        
        if (!slug) return NextResponse.json({ error: "Slug is required" }, { status: 400 });

        const id = crypto.randomUUID();
        await db.query("INSERT INTO featured_blogs (id, slug) VALUES (?, ?)", [id, slug.trim()]);

        return NextResponse.json({ success: true, id, slug, type: 'single' });
    } catch (error: any) {
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json({ error: "Already featured" }, { status: 409 });
        }
        return NextResponse.json({ error: "Failed to add featured blog" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { type, id, slug, project_id } = body;

        if (type === 'series') {
            if (!id) return NextResponse.json({ error: "ID is required for series" }, { status: 400 });
            await db.query(
                "UPDATE featured_blog_series SET project_id = ? WHERE id = ?",
                [project_id || null, id]
            );
            return NextResponse.json({ success: true });
        }

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
        const type = searchParams.get("type");
        const id = searchParams.get("id");
        const slug = searchParams.get("slug");
        
        if (type === 'series') {
            if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });
            await db.query("DELETE FROM featured_blog_series WHERE id = ?", [id]);
            return NextResponse.json({ success: true });
        }

        if (!slug) return NextResponse.json({ error: "Slug is required" }, { status: 400 });

        await db.query("DELETE FROM featured_blogs WHERE slug = ?", [slug]);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to remove featured blog" }, { status: 500 });
    }
}
