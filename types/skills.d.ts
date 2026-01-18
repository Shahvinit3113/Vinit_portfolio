export interface SkillCategory {
  id: string;
  category: string;
  icon: string;
  skills: SkillItem[];
}

export interface SkillItem {
  id: string;
  category_id: string;
  name: string;
  level: number;
}
