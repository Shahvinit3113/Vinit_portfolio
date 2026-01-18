"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("/api/admin/signup", {
        name,
        email,
        password,
      });

      if (res.data.success) {
        router.push("/admin/login");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-6">

      {/* Name */}
      <div>
        <label className="text-sm font-medium">Name</label>
        <input
          type="text"
          className="w-full mt-2 px-4 py-2 rounded-lg bg-background border border-border/40 focus:border-primary outline-none transition"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Email */}
      <div>
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          className="w-full mt-2 px-4 py-2 rounded-lg bg-background border border-border/40 focus:border-primary outline-none transition"
          placeholder="admin@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password */}
      <div>
        <label className="text-sm font-medium">Password</label>
        <input
          type="password"
          className="w-full mt-2 px-4 py-2 rounded-lg bg-background border border-border/40 focus:border-primary outline-none transition"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      {/* Submit */}
    {/* Submit button */}
<button
  type="submit"
  disabled={loading}
  className="w-full py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition disabled:opacity-50"
>
  {loading ? "Creating…" : "Create Account"}
</button>

{/* Login Link */}
<div className="text-center text-sm">
  <span className="text-muted-foreground">Already have an account? </span>
  <a
    href="/admin/login"
    className="text-primary font-semibold hover:underline"
  >
    Login
  </a>
</div>


    </form>
  );
}
