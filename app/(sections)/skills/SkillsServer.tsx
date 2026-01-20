import { db } from "@/server/db";
import SkillsClient from "./SkillsClient";

export default async function SkillsServer() {
  try {
    const [categories] = await db.query<any[]>("SELECT * FROM skill_categories");
    const [skills] = await db.query<any[]>("SELECT * FROM skill_items");
    const [competencies] = await db.query<any[]>("SELECT * FROM competencies ORDER BY created_on ASC");

    const data = categories.map((cat) => ({
      ...cat,
      skills: skills.filter((s) => s.category_id === cat.id),
    }));

    return <SkillsClient categories={data} competencies={competencies} />;
  } catch (error) {
    console.error("Error fetching skills:", error);
    return <SkillsClient categories={[]} competencies={[]} />;
  }
}
