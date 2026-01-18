import { NextResponse } from "next/server";
import { db } from "@/server/db";

export async function PUT(request: Request, { params }: any) {
    const { id } = await params;
    const body = await request.json();
    const { position, company, period, description, achievements, skills } = body;

    await db.query(
        "UPDATE experience SET position = ?, company = ?, period = ?, description = ? WHERE id = ?",
        [position, company, period, description, id]
    );

    // Update achievements: Delete all and re-insert
    if (achievements !== undefined) {
        await db.query("DELETE FROM experience_achievements WHERE experience_id = ?", [id]);

        if (Array.isArray(achievements) && achievements.length > 0) {
            for (const achievement of achievements) {
                if (!achievement.trim()) continue;
                await db.query(
                    "INSERT INTO experience_achievements (id, experience_id, achievement) VALUES (?, ?, ?)",
                    [crypto.randomUUID(), id, achievement.trim()]
                );
            }
        }
    }

    // Update skills: Delete all and re-insert
    if (skills !== undefined) {
        await db.query("DELETE FROM experience_skills WHERE experience_id = ?", [id]);

        if (Array.isArray(skills) && skills.length > 0) {
            for (const skill of skills) {
                if (!skill.trim()) continue;
                await db.query(
                    "INSERT INTO experience_skills (id, experience_id, skill) VALUES (?, ?, ?)",
                    [crypto.randomUUID(), id, skill.trim()]
                );
            }
        }
    }

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

export async function DELETE(request: Request, { params }: any) {
    const { id } = await params;

    // Delete associated achievements and skills first
    await db.query("DELETE FROM experience_achievements WHERE experience_id = ?", [id]);
    await db.query("DELETE FROM experience_skills WHERE experience_id = ?", [id]);
    await db.query("DELETE FROM experience WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
}
