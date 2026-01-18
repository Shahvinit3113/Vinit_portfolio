import { NextResponse } from "next/server";
import { db } from "@/server/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Input validation
  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: "Email and password are required" },
      { status: 400 }
    );
  }

  // Fetch admin user
  const [rows] = await db.query<any[]>(
    "SELECT * FROM users WHERE email = ? AND role = 'admin' LIMIT 1",
    [email]
  );

  // No user found
  if (!rows.length) {
    return NextResponse.json(
      { success: false, message: "Invalid email or password" },
      { status: 401 }
    );
  }

  const admin = rows[0];

  // Validate password
  const validPassword = await bcrypt.compare(password, admin.password_hash);

  if (!validPassword) {
    return NextResponse.json(
      { success: false, message: "Invalid email or password" },
      { status: 401 }
    );
  }

  // Success
  return NextResponse.json({
    success: true,
    message: "Login successful",
  });
}
