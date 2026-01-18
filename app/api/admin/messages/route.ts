import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET() {
    try {
        const [messages]: any = await db.query(
            "SELECT * FROM contact_messages ORDER BY created_on DESC"
        );
        return NextResponse.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch messages." },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, is_read } = body;

        if (!id) {
            return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
        }

        await db.query("UPDATE contact_messages SET is_read = ? WHERE id = ?", [is_read ? 1 : 0, id]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating message:", error);
        return NextResponse.json({ success: false, error: "Failed to update message" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });
        }

        await db.query("DELETE FROM contact_messages WHERE id = ?", [id]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting message:", error);
        return NextResponse.json({ success: false, error: "Failed to delete message" }, { status: 500 });
    }
}
