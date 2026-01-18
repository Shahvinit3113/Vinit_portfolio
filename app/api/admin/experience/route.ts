import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function GET() {
    const [experiences]: any = await db.query("SELECT * FROM experience ORDER BY created_on DESC");
    const [achievements]: any = await db.query("SELECT * FROM experience_achievements");
    const [skills]: any = await db.query("SELECT * FROM experience_skills");

    const data = experiences.map((exp: any) => ({
        ...exp,
        achievements: achievements
            .filter((a: any) => a.experience_id === exp.id)
            .map((a: any) => a.achievement),
        skills: skills
            .filter((s: any) => s.experience_id === exp.id)
            .map((s: any) => s.skill)
    }));

    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const body = await request.json();
    const id = crypto.randomUUID();

    const { position, company, period, description, achievements, skills } = body;

    await db.query(
        "INSERT INTO experience (id, position, company, period, description) VALUES (?, ?, ?, ?, ?)",
        [id, position, company, period, description]
    );

    if (achievements && Array.isArray(achievements) && achievements.length > 0) {
        for (const achievement of achievements) {
            if (!achievement.trim()) continue;
            await db.query(
                "INSERT INTO experience_achievements (id, experience_id, achievement) VALUES (?, ?, ?)",
                [crypto.randomUUID(), id, achievement.trim()]
            );
        }
    }

    if (skills && Array.isArray(skills) && skills.length > 0) {
        for (const skill of skills) {
            if (!skill.trim()) continue;
            await db.query(
                "INSERT INTO experience_skills (id, experience_id, skill) VALUES (?, ?, ?)",
                [crypto.randomUUID(), id, skill.trim()]
            );
        }
    }

    // Refetch complete object
    const [rows]: any = await db.query(
        "SELECT * FROM experience WHERE id = ?",
        [id]
    );

    const [savedAchievements]: any = await db.query(
        "SELECT achievement FROM experience_achievements WHERE experience_id = ?",
        [id]
    );

    const [savedSkills]: any = await db.query(
        "SELECT skill FROM experience_skills WHERE experience_id = ?",
        [id]
    );

    return NextResponse.json({
        success: true,
        experience: {
            ...rows[0],
            achievements: savedAchievements.map((a: any) => a.achievement),
            skills: savedSkills.map((s: any) => s.skill)
        }
    });
}
