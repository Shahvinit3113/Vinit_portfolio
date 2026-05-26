import { getDevtoPosts } from "@/lib/devto";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Fetch more posts for admin to choose from
        const posts = await getDevtoPosts();
        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch Dev.to posts" }, { status: 500 });
    }
}
