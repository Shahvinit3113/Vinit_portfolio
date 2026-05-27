import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
    try {
        const { slug } = await request.json();

        if (!slug) {
            return NextResponse.json({ error: "Slug is required" }, { status: 400 });
        }

        // Get visitor identifier (using IP + User Agent as a simple fingerprint)
        const forwarded = request.headers.get("x-forwarded-for");
        const ip = forwarded ? forwarded.split(",")[0] : "anonymous";
        const userAgent = request.headers.get("user-agent") || "";
        const visitorId = Buffer.from(`${ip}-${userAgent}`).toString("base64").slice(0, 255);

        // Check if already liked
        const [existing]: any = await db.query(
            "SELECT id FROM blog_likes WHERE post_slug = ? AND visitor_id = ?",
            [slug, visitorId]
        );

        if (existing && existing.length > 0) {
            return NextResponse.json({ message: "Already liked", liked: true });
        }

        // Insert new like
        const id = uuidv4();
        await db.query(
            "INSERT INTO blog_likes (id, post_slug, visitor_id) VALUES (?, ?, ?)",
            [id, slug, visitorId]
        );

        return NextResponse.json({ success: true, liked: true });
    } catch (error) {
        console.error("Error saving like:", error);
        return NextResponse.json({ error: "Failed to save like" }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get("slug");

        if (!slug) {
            return NextResponse.json({ error: "Slug is required" }, { status: 400 });
        }

        // Get total likes for this post
        const [result]: any = await db.query(
            "SELECT COUNT(*) as count FROM blog_likes WHERE post_slug = ?",
            [slug]
        );

        return NextResponse.json({ likeCount: result[0]?.count || 0 });
    } catch (error) {
        console.error("Error fetching likes:", error);
        return NextResponse.json({ likeCount: 0 });
    }
}
