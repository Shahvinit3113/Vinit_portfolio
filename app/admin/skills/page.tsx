// app/skills/page.tsx
import { db } from "@/server/db";
import SkillsClient from "./SkillsClient";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default async function SkillsPage() {
  try {
    const [categories] = await db.query<any[]>("SELECT * FROM skill_categories ORDER BY created_on ASC");
    const [skills] = await db.query<any[]>("SELECT * FROM skill_items ORDER BY created_on ASC");

    const merged = categories.map(c => ({
      ...c,
      skills: skills.filter(s => s.category_id === c.id)
    }));

    return <SkillsClient categories={merged} />;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return <SkillsClient categories={[]} />;
  }
}
