import { getHashnodePosts } from "@/lib/hashnode";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Fetch more posts for admin to choose from
        const posts = await getHashnodePosts();
        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch Hashnode posts" }, { status: 500 });
    }
}
