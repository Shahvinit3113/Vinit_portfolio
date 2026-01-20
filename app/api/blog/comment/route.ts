import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
    try {
        const { slug, name, email, content } = await request.json();

        if (!slug || !name || !content) {
            return NextResponse.json({ error: "Slug, name, and content are required" }, { status: 400 });
        }

        const id = uuidv4();
        await db.query(
            "INSERT INTO blog_comments (id, post_slug, author_name, author_email, content, is_approved) VALUES (?, ?, ?, ?, ?, 0)",
            [id, slug, name, email || null, content]
        );

        return NextResponse.json({ success: true, id });
    } catch (error) {
        console.error("Error saving comment:", error);
        return NextResponse.json({ error: "Failed to save comment" }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get("slug");

        if (!slug) {
            return NextResponse.json({ error: "Slug is required" }, { status: 400 });
        }

        // Only return approved comments
        const [comments]: any = await db.query(
            "SELECT id, author_name, content, created_on FROM blog_comments WHERE post_slug = ? AND is_approved = 1 AND is_deleted = 0 ORDER BY created_on DESC",
            [slug]
        );

        return NextResponse.json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json([]);
    }
}
