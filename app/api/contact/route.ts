import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, message } = body;

        // Simple validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { success: false, error: "Name, email, and message are required." },
                { status: 400 }
            );
        }

        const id = crypto.randomUUID();

        await db.query(
            "INSERT INTO contact_messages (id, name, email, message) VALUES (?, ?, ?, ?)",
            [id, name, email, message]
        );

        return NextResponse.json({ success: true, message: "Message sent successfully!" });
    } catch (error) {
        console.error("Error submitting contact form:", error);
        return NextResponse.json(
            { success: false, error: "Failed to send message." },
            { status: 500 }
        );
    }
}
