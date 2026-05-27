import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";

export async function POST(request: Request) {
  const body = await request.json();
  const id = crypto.randomUUID();

  const categoryId = String(body.category_id || "");

  console.log("BODY RECEIVED:", body);           // 🔥 debug
  console.log("category_id:", categoryId);       // 🔥 debug

  await db.query(
    "INSERT INTO skill_items (id, category_id, name, level) VALUES (?, ?, ?, ?)",
    [id, categoryId, body.name, body.level]
  );

  const rows = await db.query(
    "SELECT * FROM skill_items WHERE id = ?", [id]
  );

  return NextResponse.json({ success: true, skill: rows[0] });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.query("DELETE FROM skill_items WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting skill item:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

