import { NextResponse } from "next/server";
import { db } from "@/server/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { success: false, message: "All fields are required" },
      { status: 400 }
    );
  }

  // Check if email already exists
  const [existing] = await db.query<any[]>(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  if (existing.length > 0) {
    return NextResponse.json(
      { success: false, message: "Email already registered" },
      { status: 409 }
    );
  }

  // Hash password
  const hash = await bcrypt.hash(password, 10);

  // Insert new user
  await db.query(
    "INSERT INTO users (id, name, email, password_hash, role) VALUES (UUID(), ?, ?, ?, 'admin')",
    [name, email, hash]
  );

  return NextResponse.json({
    success: true,
    message: "Signup successful. Please log in.",
  });
}
