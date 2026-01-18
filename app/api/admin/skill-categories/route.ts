import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET() {
  const [rows] = await db.query("SELECT * FROM skill_categories ORDER BY created_on ASC");
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  const body = await request.json();
  const id = crypto.randomUUID();

  await db.query(
    "INSERT INTO skill_categories (id, category, icon) VALUES (?, ?, ?)",
    [id, body.category, body.icon]
  );

  const [rows]: any = await db.query(
    "SELECT * FROM skill_categories WHERE id = ?",
    [id]
  );

  return NextResponse.json({ success: true, category: rows[0] });
}

export async function DELETE() {
  // DELETE should be handled in skill-categories/[id]/route.ts
  return NextResponse.json({ success: false });
}
